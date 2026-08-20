import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

import type { FlowCapabilities } from '../../src/lib/flow-capabilities';

type DeclarationSet = {
  interfaces: Map<string, ts.InterfaceDeclaration>;
  aliases: Map<string, ts.TypeAliasDeclaration>;
};

type PropertyContract = { required: string[]; optional: string[] };

type SourceProvenance = {
  snapshot: string;
  sourcePath: string;
  sourceUrl: string;
  gitBlobSha: string;
  sha256: string;
};

type Provenance = {
  release: string;
  targetCommit: string;
  declarations: Record<
    'flow' | 'variant',
    Omit<SourceProvenance, 'snapshot'>
  >;
  runtimeSources: Record<'validation' | 'implementation', SourceProvenance>;
  vendoredRuntime: {
    provenancePath: string;
    byteLength: number;
    sha256: string;
  };
};

type VendoredProvenance = {
  release: string;
  targetCommit: string;
  byteLength: number;
  sha256: string;
};

function parseDeclarations(fileName: string, source: string): DeclarationSet {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
  const interfaces = new Map<string, ts.InterfaceDeclaration>();
  const aliases = new Map<string, ts.TypeAliasDeclaration>();

  for (const statement of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(statement)) interfaces.set(statement.name.text, statement);
    if (ts.isTypeAliasDeclaration(statement)) aliases.set(statement.name.text, statement);
  }
  return { interfaces, aliases };
}

function mergeDeclarations(...sets: DeclarationSet[]): DeclarationSet {
  return {
    interfaces: new Map(sets.flatMap((set) => [...set.interfaces])),
    aliases: new Map(sets.flatMap((set) => [...set.aliases])),
  };
}

function declarationEntries(declarations: DeclarationSet) {
  return new Map<string, ts.InterfaceDeclaration | ts.TypeAliasDeclaration>([
    ...declarations.interfaces,
    ...declarations.aliases,
  ]);
}

function normalizedContractSource(node: ts.Node): string {
  return node
    .getText()
    .replace(/^export\s+/, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,:|?<>()[\]])\s*/g, '$1')
    .trim();
}

function extractPublicContract(
  flowDeclarations: DeclarationSet,
  declarations: DeclarationSet,
  registration: ts.MethodSignature,
): Record<string, string> {
  const available = declarationEntries(declarations);
  const selected = new Set(declarationEntries(flowDeclarations).keys());
  const pending = [...selected];

  while (pending.length > 0) {
    const declaration = available.get(pending.pop()!);
    assert(declaration);
    declaration.forEachChild(function visit(node) {
      if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
        const name = node.typeName.text;
        if (available.has(name) && !selected.has(name)) {
          selected.add(name);
          pending.push(name);
        }
      }
      if (ts.isExpressionWithTypeArguments(node) && ts.isIdentifier(node.expression)) {
        const name = node.expression.text;
        if (available.has(name) && !selected.has(name)) {
          selected.add(name);
          pending.push(name);
        }
      }
      node.forEachChild(visit);
    });
  }

  return Object.fromEntries([
    ...[...selected]
      .sort()
      .map((name) => [name, normalizedContractSource(available.get(name)!)] as const),
    ['BugDropPublicAPI.registerFlow', normalizedContractSource(registration)],
  ]);
}

function namedMembers(declarations: DeclarationSet, interfaceName: string): ts.TypeElement[] {
  const declaration = declarations.interfaces.get(interfaceName);
  assert(declaration, `missing interface ${interfaceName}`);
  const inherited =
    declaration.heritageClauses?.flatMap((clause) =>
      clause.types.flatMap((type) => namedMembers(declarations, type.expression.getText())),
    ) ?? [];
  return [...inherited, ...declaration.members];
}

function memberName(member: ts.TypeElement): string {
  assert(member.name && ts.isIdentifier(member.name), 'expected an identifier member name');
  return member.name.text;
}

function memberType(
  declarations: DeclarationSet,
  interfaceName: string,
  propertyName: string,
): ts.TypeNode {
  const member = namedMembers(declarations, interfaceName).find(
    (candidate) => memberName(candidate) === propertyName,
  );
  assert(member && ts.isPropertySignature(member) && member.type, `${interfaceName}.${propertyName}`);
  return member.type;
}

function typeLiteralMember(type: ts.TypeNode, propertyName: string): ts.TypeNode {
  assert(ts.isTypeLiteralNode(type), `expected a type literal containing ${propertyName}`);
  const member = type.members.find((candidate) => memberName(candidate) === propertyName);
  assert(member && ts.isPropertySignature(member) && member.type, `missing property ${propertyName}`);
  return member.type;
}

function literalValues(declarations: DeclarationSet, type: ts.TypeNode): Array<string | number> {
  if (ts.isUnionTypeNode(type)) return type.types.flatMap((item) => literalValues(declarations, item));
  if (ts.isLiteralTypeNode(type)) {
    if (ts.isStringLiteral(type.literal) || ts.isNumericLiteral(type.literal)) {
      return [ts.isNumericLiteral(type.literal) ? Number(type.literal.text) : type.literal.text];
    }
    if (type.literal.kind === ts.SyntaxKind.NullKeyword) return ['null'];
  }
  if (ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName)) {
    const alias = declarations.aliases.get(type.typeName.text);
    assert(alias, `missing type alias ${type.typeName.text}`);
    return literalValues(declarations, alias.type);
  }
  return [];
}

function primitiveAndLiteralValues(
  declarations: DeclarationSet,
  type: ts.TypeNode,
): Array<string | number> {
  if (ts.isUnionTypeNode(type)) {
    return type.types.flatMap((item) => primitiveAndLiteralValues(declarations, item));
  }
  const primitive = new Map<ts.SyntaxKind, string>([
    [ts.SyntaxKind.StringKeyword, 'string'],
    [ts.SyntaxKind.NumberKeyword, 'number'],
    [ts.SyntaxKind.BooleanKeyword, 'boolean'],
  ]).get(type.kind);
  return primitive ? [primitive] : literalValues(declarations, type);
}

function aliasUnionMembers(declarations: DeclarationSet, aliasName: string): ts.TypeNode[] {
  const alias = declarations.aliases.get(aliasName);
  assert(alias, `missing type alias ${aliasName}`);
  return ts.isUnionTypeNode(alias.type) ? [...alias.type.types] : [alias.type];
}

function referencedInterfaces(declarations: DeclarationSet, aliasName: string): string[] {
  return aliasUnionMembers(declarations, aliasName).flatMap((type) => {
    if (!ts.isTypeReferenceNode(type) || !ts.isIdentifier(type.typeName)) return [];
    return declarations.aliases.has(type.typeName.text)
      ? referencedInterfaces(declarations, type.typeName.text)
      : [type.typeName.text];
  });
}

function discriminatorMap(
  declarations: DeclarationSet,
  aliasName: string,
  discriminator: string,
): Map<string, string> {
  return new Map(
    referencedInterfaces(declarations, aliasName).map((interfaceName) => {
      const values = literalValues(declarations, memberType(declarations, interfaceName, discriminator));
      assert.equal(values.length, 1, `${interfaceName}.${discriminator} must be one literal`);
      return [String(values[0]), interfaceName];
    }),
  );
}

function propertyContract(members: readonly ts.TypeElement[]): PropertyContract {
  const contract: PropertyContract = { required: [], optional: [] };
  for (const member of members) {
    contract[member.questionToken ? 'optional' : 'required'].push(memberName(member));
  }
  return contract;
}

function typeLiteralContract(type: ts.TypeNode): PropertyContract {
  assert(ts.isTypeLiteralNode(type), 'expected type literal property contract');
  return propertyContract(type.members);
}

function sorted(value: readonly (string | number)[]): Array<string | number> {
  return [...value].sort((left, right) => String(left).localeCompare(String(right)));
}

function exactSet(
  actual: readonly (string | number)[],
  expected: readonly (string | number)[],
  label: string,
) {
  assert.deepEqual(sorted(actual), sorted(expected), label);
}

function exactContract(
  actual: { readonly required: readonly string[]; readonly optional: readonly string[] },
  expected: PropertyContract,
  label: string,
) {
  exactSet(actual.required, expected.required, `${label} required properties`);
  exactSet(actual.optional, expected.optional, `${label} optional properties`);
}

function sha256(source: string): string {
  return createHash('sha256').update(source).digest('hex');
}

function gitBlobSha(source: string): string {
  return createHash('sha1')
    .update(`blob ${Buffer.byteLength(source)}\0`)
    .update(source)
    .digest('hex');
}

function verifySource(source: string, evidence: SourceProvenance, commit: string) {
  assert.equal(sha256(source), evidence.sha256, `${evidence.sourcePath} SHA-256`);
  assert.equal(gitBlobSha(source), evidence.gitBlobSha, `${evidence.sourcePath} Git blob SHA`);
  assert(evidence.sourceUrl.includes(commit), `${evidence.sourcePath} URL must pin the commit`);
}

function numberFromSource(value: string): number {
  return Number(value.replaceAll('_', ''));
}

function requiredMatch(source: string, pattern: RegExp, label: string): RegExpMatchArray {
  const match = source.match(pattern);
  assert(match, `could not derive ${label} from authenticated runtime source`);
  return match;
}

function extractRuntimeFacts(validation: string, implementation: string) {
  const duration = requiredMatch(
    validation,
    /Number\.isInteger\(value\) \|\| value < ([\d_]+) \|\| value > ([\d_]+)/,
    'duration bounds',
  );
  const frameBounds = Object.fromEntries(
    [...validation.matchAll(/bounded\(value\.(\w+), (-?[\d._]+), (-?[\d._]+),/g)].map(
      (match) => [
        match[1],
        { minimum: numberFromSource(match[2]), maximum: numberFromSource(match[3]) },
      ],
    ),
  );
  assert.equal(Object.keys(frameBounds).length, 4, 'expected four source-derived frame bounds');

  const defaultDurationMs: Record<string, number> = {};
  for (const match of implementation.matchAll(
    /(?:'([^']+)'|([a-z-]+)): \{\n\s+defaultDurationMs: ([\d_]+),/g,
  )) {
    defaultDurationMs[match[1] ?? match[2]] = numberFromSource(match[3]);
  }
  const customDuration = requiredMatch(
    implementation,
    /const CUSTOM_STRATEGY[^=]*= \{\n\s+defaultDurationMs: ([\d_]+),/,
    'custom duration default',
  );
  defaultDurationMs.custom = numberFromSource(customDuration[1]);

  const frameDefaults = Object.fromEntries(
    [...implementation.matchAll(/frame\.(\w+) \?\? (-?[\d._]+)/g)].map((match) => [
      match[1],
      numberFromSource(match[2]),
    ]),
  );
  assert.equal(Object.keys(frameDefaults).length, 4, 'expected four source-derived frame defaults');

  const runtimeDeclarations = parseDeclarations('screen-transition.ts', implementation);
  const directionAlias = runtimeDeclarations.aliases.get('FlowScreenDirection');
  assert(directionAlias, 'missing FlowScreenDirection');
  const customEasingDefault = requiredMatch(
    implementation,
    /CUSTOM_EASINGS\[configured\.easing \?\? '([^']+)'\]/,
    'custom easing default',
  )[1];
  assert(implementation.includes('const motion = configured[direction]'));
  assert(implementation.includes('const classes = strategy.classes(direction)'));

  const immediateWhen: string[] = [];
  if (implementation.includes("if (!configured || configured.kind === 'none') return undefined")) {
    immediateWhen.push('transition omitted', 'kind none');
  }
  if (implementation.includes('if (!direction || !outgoing || !strategy || prefersReducedMotion())')) {
    immediateWhen.push('initial screen', 'reduced motion');
  }
  assert.equal(immediateWhen.length, 4, 'expected all source-derived immediate cases');

  return {
    durationMs: {
      minimum: numberFromSource(duration[1]),
      maximum: numberFromSource(duration[2]),
      integer: true,
    },
    defaultDurationMs,
    frameBounds,
    frameDefaults,
    directions: literalValues(runtimeDeclarations, directionAlias.type),
    customEasingDefault,
    directionBehavior: 'configured motion and built-in slide classes follow the navigation direction',
    immediateWhen,
  };
}

function unionBranchByLiteral(
  declarations: DeclarationSet,
  aliasName: string,
  propertyName: string,
): Map<string, ts.TypeLiteralNode> {
  const result = new Map<string, ts.TypeLiteralNode>();
  for (const branch of aliasUnionMembers(declarations, aliasName)) {
    assert(ts.isTypeLiteralNode(branch), `${aliasName} branch must be an object`);
    for (const value of literalValues(declarations, typeLiteralMember(branch, propertyName))) {
      result.set(String(value), branch);
    }
  }
  return result;
}

export async function assertFlowCapabilityParity(
  capabilities: FlowCapabilities,
  fixtureDirectory: string,
  repositoryRoot: string,
): Promise<void> {
  const flowPath = path.join(fixtureDirectory, 'flows-public-types.d.ts');
  const variantPath = path.join(fixtureDirectory, 'variants-public-types.d.ts');
  const provenancePath = path.join(fixtureDirectory, 'PROVENANCE.json');
  const [flowSource, variantSource, provenanceSource] = await Promise.all([
    readFile(flowPath, 'utf8'),
    readFile(variantPath, 'utf8'),
    readFile(provenancePath, 'utf8'),
  ]);
  const provenance = JSON.parse(provenanceSource) as Provenance;
  const [validationSource, implementationSource] = await Promise.all([
    readFile(path.join(fixtureDirectory, provenance.runtimeSources.validation.snapshot), 'utf8'),
    readFile(path.join(fixtureDirectory, provenance.runtimeSources.implementation.snapshot), 'utf8'),
  ]);
  verifySource(flowSource, { ...provenance.declarations.flow, snapshot: '' }, provenance.targetCommit);
  verifySource(
    variantSource,
    { ...provenance.declarations.variant, snapshot: '' },
    provenance.targetCommit,
  );
  verifySource(validationSource, provenance.runtimeSources.validation, provenance.targetCommit);
  verifySource(implementationSource, provenance.runtimeSources.implementation, provenance.targetCommit);

  const flowDeclarations = parseDeclarations(flowPath, flowSource);
  const declarations = mergeDeclarations(
    flowDeclarations,
    parseDeclarations(variantPath, variantSource),
  );
  assert.equal(capabilities.release, provenance.release);
  assert.equal(capabilities.targetCommit, provenance.targetCommit);
  assert.equal(capabilities.versionKey, `${provenance.release}@${provenance.targetCommit}`);

  const vendored = JSON.parse(
    await readFile(path.join(repositoryRoot, provenance.vendoredRuntime.provenancePath), 'utf8'),
  ) as VendoredProvenance;
  assert.deepEqual(
    {
      release: capabilities.release,
      targetCommit: capabilities.targetCommit,
      byteLength: capabilities.runtime.byteLength,
      sha256: capabilities.runtime.sha256,
    },
    {
      release: vendored.release,
      targetCommit: vendored.targetCommit,
      byteLength: vendored.byteLength,
      sha256: vendored.sha256,
    },
    'manifest and vendored runtime provenance drifted',
  );
  assert.equal(vendored.byteLength, provenance.vendoredRuntime.byteLength);
  assert.equal(vendored.sha256, provenance.vendoredRuntime.sha256);

  const registration = namedMembers(declarations, 'BugDropPublicAPI').find(
    (member) => memberName(member) === capabilities.registration.method,
  );
  assert(registration && ts.isMethodSignature(registration) && registration.type);
  assert.deepEqual(
    capabilities.publicContract,
    extractPublicContract(flowDeclarations, declarations, registration),
    'canonical public value-type contract drifted',
  );
  assert.equal(registration.parameters.length, 1);
  assert.equal(registration.parameters[0].name.getText(), capabilities.registration.parameter);
  assert.equal(
    registration.parameters[0].type?.getText().split('.').at(-1),
    capabilities.registration.parameterType,
  );
  assert.equal(
    registration.parameters[0].questionToken === undefined,
    capabilities.registration.parameterRequired,
  );
  assert.equal(registration.type.getText().split('.').at(-1), capabilities.registration.returnType);

  exactContract(
    capabilities.configProperties,
    propertyContract(namedMembers(declarations, 'FlowConfig')),
    'FlowConfig',
  );
  exactSet(
    capabilities.configVersion,
    literalValues(declarations, memberType(declarations, 'FlowConfig', 'configVersion')),
    'configVersion',
  );

  const fieldMap = discriminatorMap(declarations, 'FlowField', 'type');
  exactSet(capabilities.fields.types, [...fieldMap.keys()], 'field types');
  for (const [type, interfaceName] of fieldMap) {
    exactContract(
      capabilities.fields.byType[type as keyof typeof capabilities.fields.byType],
      propertyContract(namedMembers(declarations, interfaceName)),
      `${type} field`,
    );
    exactSet(
      capabilities.fields.layoutSpans,
      literalValues(
        declarations,
        typeLiteralMember(memberType(declarations, interfaceName, 'layout'), 'span'),
      ),
      `${type} field spans`,
    );
  }
  const baseLayout = memberType(declarations, 'BaseField', 'layout');
  exactContract(capabilities.fields.layoutProperties, typeLiteralContract(baseLayout), 'field layout');
  exactSet(
    capabilities.fields.layoutSpans,
    literalValues(declarations, typeLiteralMember(baseLayout, 'span')),
    'field spans',
  );
  const options = memberType(declarations, 'SingleChoiceField', 'options');
  assert(ts.isTypeReferenceNode(options) && options.typeArguments?.[0]);
  exactContract(capabilities.fields.optionShape, typeLiteralContract(options.typeArguments[0]), 'choice option');
  exactSet(capabilities.fields.ratingScales, literalValues(declarations, memberType(declarations, 'RatingField', 'scale')), 'rating scales');
  exactSet(capabilities.fields.ratingIcons, literalValues(declarations, memberType(declarations, 'RatingField', 'icon')), 'rating icons');
  exactSet(capabilities.fields.singleChoiceDisplays, literalValues(declarations, memberType(declarations, 'SingleChoiceField', 'display')), 'choice displays');

  exactContract(capabilities.forms.properties, propertyContract(namedMembers(declarations, 'FlowForm')), 'FlowForm');
  const screenMap = discriminatorMap(declarations, 'FlowScreen', 'type');
  exactSet(capabilities.screens.types, [...screenMap.keys()], 'screen types');
  for (const [type, interfaceName] of screenMap) {
    exactContract(
      capabilities.screens.byType[type as keyof typeof capabilities.screens.byType],
      propertyContract(namedMembers(declarations, interfaceName)),
      `${type} screen`,
    );
  }
  exactSet(capabilities.screens.screenshotModes, literalValues(declarations, memberType(declarations, 'ScreenshotScreen', 'mode')), 'screenshot modes');

  const conditionBranches = aliasUnionMembers(declarations, 'FlowCondition');
  const recursiveBranches: string[] = [];
  const conditionOperators: string[] = [];
  for (const branch of conditionBranches) {
    assert(ts.isTypeLiteralNode(branch));
    const operator = memberName(branch.members[0]);
    conditionOperators.push(operator);
    exactContract(
      capabilities.conditions.branches[operator as keyof typeof capabilities.conditions.branches],
      typeLiteralContract(branch),
      `${operator} condition`,
    );
    if (operator === 'all' || operator === 'any') {
      const childType = typeLiteralMember(branch, operator);
      assert(ts.isArrayTypeNode(childType));
      assert.equal(childType.elementType.getText(), 'FlowCondition');
      recursiveBranches.push(operator);
    } else {
      assert.equal(typeLiteralMember(branch, 'equals').getText(), 'FlowScalar');
    }
  }
  exactSet(
    Object.keys(capabilities.conditions.branches),
    conditionOperators,
    'condition branch keys',
  );
  exactSet(capabilities.conditions.recursiveBranches, recursiveBranches, 'recursive conditions');
  exactSet(
    capabilities.conditions.scalarTypes,
    primitiveAndLiteralValues(declarations, declarations.aliases.get('FlowScalar')!.type),
    'condition scalar types',
  );
  exactSet(
    capabilities.conditions.contextValueTypes,
    primitiveAndLiteralValues(
      declarations,
      declarations.aliases.get('VariantContextValue')!.type,
    ),
    'context value types',
  );

  const presentation = memberType(declarations, 'FlowConfig', 'presentation');
  exactContract(capabilities.presentation.properties, typeLiteralContract(presentation), 'presentation');
  exactSet(capabilities.presentation.kinds, literalValues(declarations, typeLiteralMember(presentation, 'kind')), 'presentation kinds');
  exactSet(capabilities.presentation.sizes, literalValues(declarations, typeLiteralMember(presentation, 'size')), 'presentation sizes');
  exactSet(capabilities.presentation.columns, literalValues(declarations, typeLiteralMember(presentation, 'columns')), 'presentation columns');
  assert.equal(typeLiteralMember(presentation, 'screenTransition').getText(), 'FlowScreenTransition');
  const appearance = memberType(declarations, 'FlowConfig', 'appearance');
  exactContract(capabilities.appearance.properties, typeLiteralContract(appearance), 'appearance');
  exactSet(capabilities.appearance.themes, literalValues(declarations, typeLiteralMember(appearance, 'theme')), 'appearance themes');
  exactSet(capabilities.appearance.densities, literalValues(declarations, typeLiteralMember(appearance, 'density')), 'appearance densities');
  exactContract(capabilities.content.properties, typeLiteralContract(memberType(declarations, 'FlowConfig', 'content')), 'content');

  const transitionBranches = unionBranchByLiteral(declarations, 'FlowScreenTransition', 'kind');
  exactSet(capabilities.transitions.kinds, [...transitionBranches.keys()], 'transition kinds');
  exactSet(capabilities.transitions.builtInKinds, [...transitionBranches.keys()].filter((kind) => kind !== 'none' && kind !== 'custom'), 'built-in transition kinds');
  exactContract(capabilities.transitions.branches.none, typeLiteralContract(transitionBranches.get('none')!), 'none transition');
  for (const kind of capabilities.transitions.builtInKinds) {
    exactContract(
      capabilities.transitions.branches.builtIn,
      typeLiteralContract(transitionBranches.get(kind)!),
      `${kind} transition`,
    );
  }
  exactContract(capabilities.transitions.branches.custom, typeLiteralContract(transitionBranches.get('custom')!), 'custom transition');
  exactSet(
    Object.keys(capabilities.transitions.branches),
    ['none', 'builtIn', 'custom'],
    'transition branch categories',
  );
  exactSet(capabilities.transitions.easings, literalValues(declarations, typeLiteralMember(transitionBranches.get('custom')!, 'easing')), 'transition easings');
  exactContract(capabilities.transitions.motionProperties, propertyContract(namedMembers(declarations, 'FlowScreenTransitionMotion')), 'transition motion');
  exactContract(capabilities.transitions.frameProperties, propertyContract(namedMembers(declarations, 'FlowScreenTransitionFrame')), 'transition frame');
  const runtimeFacts = extractRuntimeFacts(validationSource, implementationSource);
  assert.deepEqual(
    {
      durationMs: capabilities.transitions.durationMs,
      defaultDurationMs: capabilities.transitions.defaultDurationMs,
      frameBounds: capabilities.transitions.frameBounds,
      frameDefaults: capabilities.transitions.frameDefaults,
      directions: capabilities.transitions.directions,
      customEasingDefault: capabilities.transitions.customEasingDefault,
      directionBehavior: capabilities.transitions.directionBehavior,
      immediateWhen: capabilities.transitions.immediateWhen,
    },
    runtimeFacts,
    'runtime transition facts must be derived from authenticated source snapshots',
  );

  const issue = memberType(declarations, 'FlowConfig', 'issue');
  exactContract(capabilities.issue.properties, typeLiteralContract(issue), 'issue');
  exactSet(capabilities.issue.classifications, literalValues(declarations, typeLiteralMember(issue, 'classification')), 'issue classifications');
  const issueBranches = aliasUnionMembers(declarations, 'FlowIssueSection');
  const issueBranchKinds: string[] = [];
  for (const branch of issueBranches) {
    assert(ts.isTypeLiteralNode(branch));
    const kind = branch.members.some((member) => memberName(member) === 'answer')
      ? 'answer'
      : 'context';
    issueBranchKinds.push(kind);
    exactContract(capabilities.issue.sections[kind].properties, typeLiteralContract(branch), `${kind} issue section`);
    exactSet(capabilities.issue.sections[kind].formats, literalValues(declarations, typeLiteralMember(branch, 'format')), `${kind} issue formats`);
  }
  exactSet(Object.keys(capabilities.issue.sections), issueBranchKinds, 'issue-section branch keys');

  const evidence = memberType(declarations, 'FlowConfig', 'evidence');
  exactContract(capabilities.evidence.properties, typeLiteralContract(evidence), 'evidence');
  exactContract(capabilities.evidence.submitterProperties, typeLiteralContract(typeLiteralMember(evidence, 'submitter')), 'submitter evidence');
  exactContract(capabilities.lifecycle.handleProperties, propertyContract(namedMembers(declarations, 'FlowHandle')), 'FlowHandle');
  const openMethod = namedMembers(declarations, 'FlowHandle').find(
    (member) => memberName(member) === 'open',
  );
  assert(openMethod && ts.isMethodSignature(openMethod) && openMethod.type);
  assert.equal(openMethod.parameters.length, 1);
  assert.equal(openMethod.parameters[0].name.getText(), capabilities.lifecycle.openMethod.parameter);
  assert.equal(
    openMethod.parameters[0].type?.getText(),
    capabilities.lifecycle.openMethod.parameterType,
  );
  assert.equal(
    openMethod.parameters[0].questionToken === undefined,
    capabilities.lifecycle.openMethod.parameterRequired,
  );
  assert.equal(openMethod.type.getText(), capabilities.lifecycle.openMethod.returnType);
  exactContract(capabilities.lifecycle.openOptionProperties, propertyContract(namedMembers(declarations, 'FlowOpenOptions')), 'FlowOpenOptions');
  exactContract(capabilities.lifecycle.openedProperties, propertyContract(namedMembers(declarations, 'OpenedFlow')), 'OpenedFlow');
  const closeMethod = namedMembers(declarations, 'OpenedFlow').find(
    (member) => memberName(member) === 'close',
  );
  assert(closeMethod && ts.isMethodSignature(closeMethod) && closeMethod.type);
  assert.equal(closeMethod.parameters.length, capabilities.lifecycle.closeMethod.parameterCount);
  assert.equal(closeMethod.type.getText(), capabilities.lifecycle.closeMethod.returnType);
  const outcomeBranches = unionBranchByLiteral(declarations, 'FlowOutcome', 'status');
  exactSet(
    Object.keys(capabilities.lifecycle.outcomeBranches),
    [...outcomeBranches.keys()],
    'outcome branch keys',
  );
  for (const [status, branch] of outcomeBranches) {
    exactContract(capabilities.lifecycle.outcomeBranches[status as keyof typeof capabilities.lifecycle.outcomeBranches], typeLiteralContract(branch), `${status} outcome`);
  }
  exactContract(capabilities.lifecycle.submissionResultProperties, propertyContract(namedMembers(declarations, 'SubmissionResult')), 'SubmissionResult');

  assert(!capabilities.fields.types.includes('multiSelect'));
  assert(capabilities.exclusions.unreleased.includes('field.type=multiSelect'));
  const variantPresentation = memberType(declarations, 'VariantConfig', 'presentation');
  assert(ts.isUnionTypeNode(variantPresentation));
  assert(variantPresentation.types.some((branch) => literalValues(declarations, typeLiteralMember(branch, 'kind')).includes('inline')));
  assert(literalValues(declarations, declarations.aliases.get('VariantClassification')!.type).includes('feedback'));
  const variantHandleMembers = namedMembers(declarations, 'VariantHandle').map(memberName);
  assert(variantHandleMembers.includes('mount') && variantHandleMembers.includes('submit'));
}
