const MAX_LOCAL_SUBMISSIONS = 20;
export const MAX_LOCAL_SUBMISSION_BYTES = 48 * 1024 * 1024;

export interface LocalSubmissionRecord {
  id: number;
  createdAt: string;
  payload: Record<string, unknown>;
}

interface LocalSubmissionStore {
  nextId: number;
  records: LocalSubmissionRecord[];
}

const processStore = globalThis as typeof globalThis & {
  __bugDropPublicFlowLabStore?: LocalSubmissionStore;
};

function store() {
  processStore.__bugDropPublicFlowLabStore ??= { nextId: 1, records: [] };
  return processStore.__bugDropPublicFlowLabStore;
}

export function isLocalInspectorRequest(
  host: string | null,
  environment = process.env.NODE_ENV,
) {
  return (
    environment === "development" &&
    host?.toLowerCase() === "bugdrop.localhost:3000"
  );
}

export function isLocalInspectorMutationRequest(
  host: string | null,
  origin: string | null,
  contentType: string | null,
  environment = process.env.NODE_ENV,
) {
  return (
    isLocalInspectorRequest(host, environment) &&
    origin === "http://bugdrop.localhost:3000" &&
    contentType?.split(";", 1)[0]?.trim().toLowerCase() === "application/json"
  );
}

export function createLocalSubmission(payload: Record<string, unknown>) {
  const localStore = store();
  const record: LocalSubmissionRecord = {
    id: localStore.nextId,
    createdAt: new Date().toISOString(),
    payload: structuredClone(payload),
  };

  localStore.nextId += 1;
  localStore.records.unshift(record);
  localStore.records.splice(MAX_LOCAL_SUBMISSIONS);
  return structuredClone(record);
}

export function getLocalSubmission(id: number) {
  const record = store().records.find((candidate) => candidate.id === id);
  return record ? structuredClone(record) : null;
}

export function clearLocalSubmissionsForTests() {
  processStore.__bugDropPublicFlowLabStore = { nextId: 1, records: [] };
}
