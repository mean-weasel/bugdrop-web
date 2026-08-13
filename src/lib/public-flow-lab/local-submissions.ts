const MAX_LOCAL_SUBMISSIONS = 20;
export const MAX_LOCAL_SUBMISSION_BYTES = 48 * 1024 * 1024;
const MAX_LOCAL_SUBMISSION_STORE_BYTES = 64 * 1024 * 1024;

export interface LocalSubmissionRecord {
  id: number;
  createdAt: string;
  payload: Record<string, unknown>;
}

interface LocalSubmissionStore {
  nextId: number;
  records: Array<LocalSubmissionRecord & { byteSize: number }>;
  totalBytes: number;
}

const processStore = globalThis as typeof globalThis & {
  __bugDropPublicFlowLabStore?: LocalSubmissionStore;
};

function store() {
  processStore.__bugDropPublicFlowLabStore ??= {
    nextId: 1,
    records: [],
    totalBytes: 0,
  };
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

export function createLocalSubmission(
  payload: Record<string, unknown>,
  byteSize = new TextEncoder().encode(JSON.stringify(payload)).byteLength,
) {
  const localStore = store();
  const record: LocalSubmissionRecord & { byteSize: number } = {
    id: localStore.nextId,
    createdAt: new Date().toISOString(),
    payload: structuredClone(payload),
    byteSize,
  };

  localStore.nextId += 1;
  localStore.records.unshift(record);
  localStore.totalBytes += byteSize;
  while (
    localStore.records.length > 1 &&
    (localStore.records.length > MAX_LOCAL_SUBMISSIONS ||
      localStore.totalBytes > MAX_LOCAL_SUBMISSION_STORE_BYTES)
  ) {
    const evicted = localStore.records.pop();
    if (evicted) localStore.totalBytes -= evicted.byteSize;
  }
  return publicRecord(record);
}

export function getLocalSubmission(id: number) {
  const record = store().records.find((candidate) => candidate.id === id);
  return record ? publicRecord(record) : null;
}

export function clearLocalSubmissionsForTests() {
  processStore.__bugDropPublicFlowLabStore = {
    nextId: 1,
    records: [],
    totalBytes: 0,
  };
}

function publicRecord(
  record: LocalSubmissionRecord & { byteSize: number },
): LocalSubmissionRecord {
  return structuredClone({
    id: record.id,
    createdAt: record.createdAt,
    payload: record.payload,
  });
}
