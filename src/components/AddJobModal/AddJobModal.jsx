import { useState } from "react";
import { STATUSES } from "../../constants/statuses";

export default function AddJobModal({ open, onClose, onAdd }) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState(STATUSES[0]);
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("hybrid");
  const [tagsText, setTagsText] = useState("");

  if (!open) return null;

  const reset = () => {
    setCompanyName("");
    setJobTitle("");
    setStatus(STATUSES[0]);
    setLocation("");
    setWorkType("hybrid");
    setTagsText("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedCompany = companyName.trim();
    const trimmedTitle = jobTitle.trim();

    if (!trimmedCompany || !trimmedTitle) return;

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 8);

    onAdd({
      id: crypto.randomUUID(),
      companyName: trimmedCompany,
      jobTitle: trimmedTitle,
      status,
      location: location.trim(),
      workType,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    reset();
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(520px, 100%)",
          background: "#fff",
          borderRadius: 16,
          padding: 18,
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, color: "#111" }}>Add Job</h2>
          <button
            onClick={onClose}
            style={{
              border: "1px solid #ddd",
              background: "#f7f7f7",
              borderRadius: 10,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <label
            style={{ display: "grid", gap: 6, fontSize: 13, color: "#333" }}
          >
            Job Title *
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Developer"
              style={inputStyle}
            />
          </label>

          <label
            style={{ display: "grid", gap: 6, fontSize: 13, color: "#333" }}
          >
            Company Name *
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Check Point"
              style={inputStyle}
            />
          </label>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <label
              style={{ display: "grid", gap: 6, fontSize: 13, color: "#333" }}
            >
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={inputStyle}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label
              style={{ display: "grid", gap: 6, fontSize: 13, color: "#333" }}
            >
              Work Type
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                style={inputStyle}
              >
                <option value="remote">remote</option>
                <option value="hybrid">hybrid</option>
                <option value="on site">on site</option>
              </select>
            </label>
          </div>

          <label
            style={{ display: "grid", gap: 6, fontSize: 13, color: "#333" }}
          >
            Location
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Tel Aviv"
              style={inputStyle}
            />
          </label>

          <label
            style={{ display: "grid", gap: 6, fontSize: 13, color: "#333" }}
          >
            Tags (comma separated)
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="React, JavaScript, Node"
              style={inputStyle}
            />
          </label>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 6,
            }}
          >
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              style={secondaryBtn}
            >
              Cancel
            </button>

            <button type="submit" style={primaryBtn}>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: "10px 12px",
  outline: "none",
};

const primaryBtn = {
  border: "1px solid #1a73e8",
  background: "#1a73e8",
  color: "#fff",
  borderRadius: 10,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryBtn = {
  border: "1px solid #ddd",
  background: "#f7f7f7",
  color: "#111",
  borderRadius: 10,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 600,
};
