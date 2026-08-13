import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLocalSubmission,
  isLocalInspectorRequest,
} from "@/lib/public-flow-lab/local-submissions";
import styles from "./page.module.css";

export default async function LocalSubmissionPage(
  props: PageProps<"/labs/variants/submissions/[id]">,
) {
  const [{ id }, requestHeaders] = await Promise.all([props.params, headers()]);
  if (!isLocalInspectorRequest(requestHeaders.get("host"))) notFound();

  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId) || numericId < 1) notFound();
  const record = getLocalSubmission(numericId);
  if (!record) notFound();

  return (
    <main className={styles.viewer}>
      <Link href="/labs/variants">← Back to the composable feedback lab</Link>
      <header>
        <span>Development-only local inspector</span>
        <h1>Stored submission #{record.id}</h1>
        <p>Captured in this Next.js process at {record.createdAt}. No GitHub Issue was created.</p>
      </header>
      <section aria-labelledby="raw-payload-heading">
        <h2 id="raw-payload-heading">Raw payload</h2>
        <pre data-testid="raw-payload">{JSON.stringify(record.payload, null, 2)}</pre>
      </section>
    </main>
  );
}
