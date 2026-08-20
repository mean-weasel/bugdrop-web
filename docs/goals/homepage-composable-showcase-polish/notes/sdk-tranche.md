# Linked SDK Tranche: Attachment Polish and Classic Accessibility

## Status

Planned only. This website goal authorizes no SDK edit, PR, merge, release, deployment, or website repin.

Validated after the completed website/configuration polish and independent desktop/mobile review. The website now uses the strongest available public FlowConfig layout: attachments and logs span the Bug Report form, desktop contact fields are paired, and mobile fields stack. The remaining attachment-control chrome is therefore an SDK presentation concern. The same review confirmed that Classic remains visually and behaviorally functional but exposes no dialog role and an unnamed `×` close control; that semantic correction also belongs in the SDK.

## Objective

After the website/configuration tranche is fully polished and audited, investigate and—only with separate owner authorization—correct the two remaining SDK-level presentation gaps:

1. make the public composable attachment field feel as deliberate and polished as Classic's existing upload treatment without changing accepted files, limits, serialization, or accessibility;
2. give Classic's modal a correct dialog semantic contract and an accessible close-button name without changing its established visual appearance, journey, payload, focus behavior, screenshots, styling configuration, or rollback artifact.

## Proposed Execution Shape

1. **Scout:** Reproduce both findings on current SDK `main`; map exact source, generated bundle, public API, Classic/fixed compatibility, tests, and whether either has already been corrected since v1.56.3.
2. **Judge:** Accept/reject each finding and define the largest safe SDK Worker package with exact files, verification, and stop conditions.
3. **Worker:** Implement only accepted local SDK corrections. Add focused unit/browser/accessibility tests and prove Classic visual/behavioral compatibility.
4. **Judge:** Run PR Review Toolkit against SDK `main`, corrected-head browser comparison, full repository gates, and rollback/fixed compatibility proof.
5. **Authority boundary:** Ask separately before commit/push/PR; separately before merge queue; separately before dry-run/live release; separately before website repin.
6. **Release/repin proof:** If later authorized, publish the next immutable patch through the normal release workflow, authenticate its exact bytes/provenance, repin the hidden website, and rerun all five desktop/mobile showcase journeys plus Classic false/unset controls.

## SDK Oracle

- Composable attachment control is visually intentional at desktop and mobile, keyboard accessible, correctly labeled, and behaviorally identical in file acceptance and wire payload.
- Classic exposes a real named dialog and an accessible Close control while screenshots, focus restoration, payloads, styling, fixed rollback, and existing customer behavior remain unchanged.
- Full SDK validation, focused field/modal tests, production configuration, legacy compatibility, paired fixed/flow proof, full E2E, and PR Review Toolkit are green.
- A named-localhost browser comparison covers desktop and 390×844 mobile, keyboard operation, screen-reader names/roles, attachment validation, capture, submission, close, and exact initiator focus restoration.
- The exact current v1.56.3 artifact remains the website baseline until a separately authorized immutable SDK patch is released and authenticated.
- No website repin occurs until an immutable released artifact is authenticated.

## Stop Conditions

- The attachment improvement requires a breaking public API or changes upload semantics.
- Classic semantics cannot be corrected without changing its visual or behavioral compatibility contract.
- Fixed rollback ceases to be byte-identical where that contract still applies.
- Any task requires unapproved commit, push, PR, merge, workflow dispatch, protected approval, tag, Release, deployment, or website repin.
- Identity, release frontier, or production state drifts from the later authorized plan.

## Recommended Next Goal

Create a fresh SDK goal rooted in the BugDrop SDK repository after the website tranche is complete:

`docs/goals/sdk-showcase-attachment-accessibility-polish/goal.md`

The SDK goal should start read-only with Scout and Judge. It must not inherit release authority from the website goal.

Recommended execution command after the owner chooses to begin that separate SDK investigation:

`/goal Follow docs/goals/sdk-showcase-attachment-accessibility-polish/goal.md.`

The future goal must create its charter and board in the SDK repository, not this website worktree, and must obtain fresh authority at each external boundary: commit/push/PR, merge queue, immutable patch release, and website repin.
