import styles from "./JobDetailsDrawer.module.css";
import { useToast } from "../Toast/ToastContext";

export default function JobDetailsDrawer({ job, open, onClose }) {
  const { addToast } = useToast();
  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <div className={styles.overlay} onClick={onClose} />

      {/* drawer */}
      <aside className={styles.drawer} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.companyRow}>
              <div className={styles.companyInitial}>
                {getInitials(job?.companyName)}
              </div>

              <div className={styles.titleBlock}>
                <div className={styles.jobTitle}>
                  {job?.jobTitle || "Untitled"}
                </div>
                <div className={styles.companyName}>
                  {job?.companyName || "Company"}
                </div>

                {job?.status && (
                  <span className={styles.statusPill}>{job.status}</span>
                )}
              </div>
            </div>
          </div>

          <button className={styles.closeBtn} onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <Section title="Details">
            <InfoRow label="Location" value={job?.location || "—"} />
            <InfoRow label="Work Type" value={job?.workType || "—"} />
            <InfoRow label="Job URL" value={job?.jobUrl || "—"} isLink />
          </Section>

          <Section title="Tags">
            {Array.isArray(job?.tags) && job.tags.length > 0 ? (
              <div className={styles.tags}>
                {job.tags.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <div className={styles.muted}>No tags</div>
            )}
          </Section>

          <Section title="Extra">
            <InfoRow label="Created" value={fmtDate(job?.createdAt)} />
            <InfoRow label="Updated" value={fmtDate(job?.updatedAt)} />
            <InfoRow label="Platform" value={job?.platform || "—"} />
          </Section>

          <Section title="Notes">
            <textarea
              className={styles.textarea}
              placeholder="Add a note here..."
              defaultValue={job?.notes || ""}
              readOnly
            />
            <div className={styles.noteHint}>
              (Later we can make notes editable + saved)
            </div>
          </Section>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.primaryBtn}
            onClick={() =>
              addToast("warning", "Warning", "Feature Not Ready Yet")
            }
          >
            Schedule Interview
          </button>
        </div>
      </aside>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, isLink }) {
  const isUrl = typeof value === "string" && value.startsWith("http");
  return (
    <div className={styles.row}>
      <div className={styles.rowLabel}>{label}</div>
      <div className={styles.rowValue}>
        {isLink && isUrl ? (
          <a href={value} target="_blank" rel="noreferrer">
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function getInitials(name) {
  if (!name) return "•";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

function fmtDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}
