import { useEffect, useState } from "react";
import { STATUSES } from "../../constants/statuses";
import "./addjobmodal.css";

export default function AddJobModal({ open, onClose, onAdd, defaultStatus }) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState(defaultStatus ?? STATUSES[0]);
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("hybrid");
  const [tagsText, setTagsText] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  // keep status synced when opening from a specific column
  useEffect(() => {
    if (open) setStatus(defaultStatus ?? STATUSES[0]);
  }, [open, defaultStatus]);

  if (!open) return null;

  const reset = () => {
    setCompanyName("");
    setJobTitle("");
    setStatus(defaultStatus ?? STATUSES[0]);
    setLocation("");
    setWorkType("hybrid");
    setTagsText("");
    setJobUrl("");
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
      jobUrl: jobUrl.trim(),
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    reset();
    onClose();
  };

  return (
    <div className="ajmOverlay" onClick={onClose}>
      <div className="ajmCard" onClick={(e) => e.stopPropagation()}>
        <div className="ajmHeader">
          <h2 className="ajmTitle">Add Job</h2>

          <button type="button" className="ajmClose" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="ajmForm" onSubmit={handleSubmit}>
          <label className="ajmLabel">
            Job Title *
            <input
              className="ajmInput"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Developer"
            />
          </label>

          <label className="ajmLabel">
            Company Name *
            <input
              className="ajmInput"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Check Point"
            />
          </label>

          <div className="ajmGrid2">
            <label className="ajmLabel">
              Status
              <select
                className="ajmInput"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label className="ajmLabel">
              Work Type
              <select
                className="ajmInput"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              >
                <option value="remote">remote</option>
                <option value="hybrid">hybrid</option>
                <option value="on site">on site</option>
              </select>
            </label>
          </div>

          <label className="ajmLabel">
            Location
            <input
              className="ajmInput"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Tel Aviv"
            />
          </label>

          <label className="ajmLabel">
            Job URL
            <input
              className="ajmInput"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className="ajmLabel">
            Tags (comma separated)
            <input
              className="ajmInput"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="React, JavaScript, Node"
            />
          </label>

          <div className="ajmActions">
            <button
              type="button"
              className="ajmBtnSecondary"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </button>

            <button type="submit" className="ajmBtnPrimary">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
