import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { FLOW_CAPABILITIES } from '../src/lib/flow-capabilities';
import type { FlowCapabilities } from '../src/lib/flow-capabilities';
import { assertFlowCapabilityParity } from './helpers/flow-capability-parity';

const repositoryRoot = process.cwd();
const fixtureDirectory = path.join(
  repositoryRoot,
  'test/fixtures/flow-capabilities/v1.56.3',
);

function mutableCapabilities() {
  return structuredClone(FLOW_CAPABILITIES) as unknown as {
    targetCommit: string;
    publicContract: Record<string, string>;
    fields: {
      types: string[];
      byType: { shortText: { required: string[]; optional: string[] } };
    };
    screens: { screenshotModes: string[] };
    conditions: { branches: Record<string, unknown> };
    issue: { sections: Record<string, unknown> };
    lifecycle: { outcomeBranches: Record<string, unknown> };
    transitions: {
      kinds: string[];
      builtInKinds: string[];
      durationMs: { maximum: number };
    };
  };
}

function checkMutated(capabilities: ReturnType<typeof mutableCapabilities>) {
  return assertFlowCapabilityParity(
    capabilities as unknown as FlowCapabilities,
    fixtureDirectory,
    repositoryRoot,
  );
}

describe('released Flow capability manifest', () => {
  it('matches authenticated declarations, runtime facts, and vendored provenance', async () => {
    await expect(
      assertFlowCapabilityParity(FLOW_CAPABILITIES, fixtureDirectory, repositoryRoot),
    ).resolves.toBeUndefined();
  });

  it('keeps Variant-only and unreleased concepts out of the Flow inventory', () => {
    expect(FLOW_CAPABILITIES.fields.types).not.toContain('multiSelect');
    expect(FLOW_CAPABILITIES.presentation.kinds).not.toContain('inline');
    expect(FLOW_CAPABILITIES.issue.classifications).not.toContain('feedback');
    expect(FLOW_CAPABILITIES.exclusions).toEqual({
      variantOnly: [
        'presentation.kind=inline',
        'issue.classification=feedback',
        'VariantHandle.mount',
        'VariantHandle.submit',
        'VariantContent requirement',
      ],
      unreleased: ['field.type=multiSelect'],
    });
  });

  it('rejects a missing-capability mutation', async () => {
    const missing = mutableCapabilities();
    missing.fields.byType.shortText.optional.pop();
    await expect(checkMutated(missing)).rejects.toThrow('shortText field optional properties');
  });

  it('rejects an extra-capability mutation', async () => {
    const added = mutableCapabilities();
    added.fields.byType.shortText.optional.push('inventedProperty');
    await expect(checkMutated(added)).rejects.toThrow('shortText field optional properties');
  });

  it('rejects runtime-value drift', async () => {
    const runtimeDrift = mutableCapabilities();
    runtimeDrift.transitions.durationMs.maximum = 999;
    await expect(checkMutated(runtimeDrift)).rejects.toThrow(
      'runtime transition facts must be derived from authenticated source snapshots',
    );
  });

  it('rejects a provenance-drift mutation', async () => {
    const provenanceDrift = mutableCapabilities();
    provenanceDrift.targetCommit = '0000000000000000000000000000000000000000';
    await expect(checkMutated(provenanceDrift)).rejects.toThrow();
  });

  it('rejects removal of every union-branch family', async () => {
    const condition = mutableCapabilities();
    delete condition.conditions.branches.answer;
    await expect(checkMutated(condition)).rejects.toThrow();

    const issue = mutableCapabilities();
    delete issue.issue.sections.context;
    await expect(checkMutated(issue)).rejects.toThrow();

    const outcome = mutableCapabilities();
    delete outcome.lifecycle.outcomeBranches.busy;
    await expect(checkMutated(outcome)).rejects.toThrow();

    const transition = mutableCapabilities();
    transition.transitions.kinds = transition.transitions.kinds.filter(
      (kind) => kind !== 'scale-fade',
    );
    await expect(checkMutated(transition)).rejects.toThrow('transition kinds');
  });

  it('rejects requiredness, value-type, and literal drift', async () => {
    const requiredness = mutableCapabilities();
    requiredness.fields.byType.shortText.optional =
      requiredness.fields.byType.shortText.optional.filter((name) => name !== 'placeholder');
    requiredness.fields.byType.shortText.required.push('placeholder');
    await expect(checkMutated(requiredness)).rejects.toThrow(
      'shortText field required properties',
    );

    const valueType = mutableCapabilities();
    valueType.publicContract.FlowForm = valueType.publicContract.FlowForm.replace(
      'fields:FlowField[]',
      'fields:number[]',
    );
    await expect(checkMutated(valueType)).rejects.toThrow(
      'canonical public value-type contract drifted',
    );

    const literal = mutableCapabilities();
    literal.screens.screenshotModes[0] = 'sometimes';
    await expect(checkMutated(literal)).rejects.toThrow('screenshot modes');

  });

  it('rejects a banned-capability mutation', async () => {
    const bannedField = mutableCapabilities();
    bannedField.fields.types.push('multiSelect');
    await expect(checkMutated(bannedField)).rejects.toThrow('field types');

    const bannedPresentation = mutableCapabilities() as ReturnType<typeof mutableCapabilities> & {
      presentation: { kinds: string[] };
    };
    bannedPresentation.presentation = { kinds: ['modal', 'inline'] };
    await expect(checkMutated(bannedPresentation)).rejects.toThrow();
  });

  it('rejects authenticated runtime-source tampering', async () => {
    const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'flow-capability-parity-'));
    const copiedFixtures = path.join(temporaryRoot, 'fixtures');
    try {
      await cp(fixtureDirectory, copiedFixtures, { recursive: true });
      const runtimePath = path.join(copiedFixtures, 'screen-transition.ts.txt');
      const runtimeSource = await readFile(runtimePath, 'utf8');
      await writeFile(runtimePath, runtimeSource.replace('defaultDurationMs: 500', 'defaultDurationMs: 501'));
      await expect(
        assertFlowCapabilityParity(FLOW_CAPABILITIES, copiedFixtures, repositoryRoot),
      ).rejects.toThrow('SHA-256');
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });
});
