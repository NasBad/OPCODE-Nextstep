import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { STATUSES } from "../../constants/statuses";
import { addJobModalSx } from "./AddJobModal.styles";
import { companyNames, getCompanyByName } from "../../data/companiesMock";

const PRESET_TAGS = [
  "React", "Vue", "Angular", "JavaScript", "TypeScript",
  "Node", "Python", "Java", "SQL", "MongoDB",
  "CSS", "HTML", "Git", "Docker", "AWS",
  "GraphQL", "REST", "Redux", "Next.js", "Figma",
];

const PLATFORMS = ["LinkedIn", "Indeed", "Glassdoor", "Company site", "Referral", "Other"];
const MAX_TAGS = 5;

export default function AddJobModal({ open, onClose, onAdd, onEdit, editJob, defaultStatus }) {
  const isEditing = Boolean(editJob);

  const [companyName, setCompanyName] = useState(editJob?.companyName ?? "");
  const [jobTitle, setJobTitle] = useState(editJob?.jobTitle ?? "");
  const [status, setStatus] = useState(editJob?.status ?? defaultStatus ?? STATUSES[0]);
  const [location, setLocation] = useState(editJob?.location ?? "");
  const [workType, setWorkType] = useState(editJob?.workType ?? "hybrid");
  const [tags, setTags] = useState(editJob?.tags ?? []);
  const [jobUrl, setJobUrl] = useState(editJob?.jobUrl ?? "");

  // Applied-level
  const [appliedDate, setAppliedDate] = useState(editJob?.appliedDate?.slice(0, 10) ?? "");
  const [platform, setPlatform] = useState(editJob?.platform ?? "");
  const [notes, setNotes] = useState(editJob?.notes ?? "");

  // Interviewing-level
  const [nextInterviewDate, setNextInterviewDate] = useState(editJob?.nextInterviewDate?.slice(0, 10) ?? "");
  const [round, setRound] = useState(editJob?.round ?? "");

  // Offer-level
  const [answerDeadline, setAnswerDeadline] = useState(editJob?.answerDeadline?.slice(0, 10) ?? "");
  const [offerAmount, setOfferAmount] = useState(editJob?.offerAmount ?? "");

  if (!open) return null;

  const showApplied = ["Applied", "Interviewing", "Offer", "Rejected"].includes(status);
  const showInterviewing = ["Interviewing", "Offer", "Rejected"].includes(status);
  const showOffer = ["Offer", "Rejected"].includes(status);

  const reset = () => {
    setCompanyName(""); setJobTitle(""); setStatus(defaultStatus ?? STATUSES[0]);
    setLocation(""); setWorkType("hybrid"); setTags([]); setJobUrl("");
    setAppliedDate(""); setPlatform(""); setNotes("");
    setNextInterviewDate(""); setRound("");
    setAnswerDeadline(""); setOfferAmount("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedCompany = companyName.trim();
    const trimmedTitle = jobTitle.trim();
    if (!trimmedCompany || !trimmedTitle) return;
    if (showApplied && !appliedDate) return;
    if (showInterviewing && !nextInterviewDate) return;

    // auto-attach logo from known companies
    const knownCompany = getCompanyByName(trimmedCompany);

    const job = {
      ...(isEditing ? editJob : { id: crypto.randomUUID(), createdAt: new Date().toISOString() }),
      companyName: trimmedCompany,
      companyLogo: knownCompany?.logo ?? editJob?.companyLogo ?? null,
      jobTitle: trimmedTitle,
      status,
      location: location.trim(),
      workType,
      jobUrl: jobUrl.trim(),
      tags,
      updatedAt: new Date().toISOString(),
    };

    if (showApplied) { job.appliedDate = appliedDate; job.platform = platform; job.notes = notes.trim(); }
    if (showInterviewing) { job.nextInterviewDate = nextInterviewDate; job.round = round.trim(); }
    if (showOffer) { job.answerDeadline = answerDeadline; job.offerAmount = offerAmount.trim(); }

    isEditing ? onEdit(job) : onAdd(job);
    if (!isEditing) reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box onClick={onClose} sx={addJobModalSx.overlay}>
        <Box component="form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} sx={addJobModalSx.card}>
          <Box sx={addJobModalSx.header}>
            <Typography sx={addJobModalSx.title}>{isEditing ? "Edit Job" : "Add Job"}</Typography>
            <Button type="button" onClick={onClose} sx={addJobModalSx.closeBtn}>
              <CloseRoundedIcon fontSize="small" />
            </Button>
          </Box>

          <Field label="Job Title *">
            <TextField
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Developer"
              size="small"
              sx={addJobModalSx.input}
            />
          </Field>

          <Field label="Company Name *">
            <Autocomplete
              freeSolo
              options={companyNames}
              value={companyName}
              onInputChange={(_, val) => setCompanyName(val)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="e.g. Google, Check Point..."
                  size="small"
                  sx={addJobModalSx.input}
                />
              )}
            />
          </Field>

          <Box sx={addJobModalSx.grid2}>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)} size="small" sx={addJobModalSx.input}>
                {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </Field>
            <Field label="Work Type">
              <Select value={workType} onChange={(e) => setWorkType(e.target.value)} size="small" sx={addJobModalSx.input}>
                <MenuItem value="remote">remote</MenuItem>
                <MenuItem value="hybrid">hybrid</MenuItem>
                <MenuItem value="on site">on site</MenuItem>
              </Select>
            </Field>
          </Box>

          <Field label="Location">
            <TextField value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Tel Aviv" size="small" sx={addJobModalSx.input} />
          </Field>

          <Field label="Job URL">
            <TextField value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://..." size="small" sx={addJobModalSx.input} />
          </Field>

          <Field label={`Tags (max ${MAX_TAGS})`}>
            <Autocomplete
              multiple
              options={PRESET_TAGS.filter((t) => !tags.includes(t))}
              value={tags}
              onChange={(_, newValue) => { if (newValue.length <= MAX_TAGS) setTags(newValue); }}
              freeSolo
              size="small"
              getOptionDisabled={() => tags.length >= MAX_TAGS}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip key={option} label={option} size="small" {...getTagProps({ index })} sx={{ fontSize: 11 }} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={tags.length >= MAX_TAGS ? `Max ${MAX_TAGS} tags` : "Add a tag..."}
                  size="small"
                  sx={addJobModalSx.input}
                  helperText={tags.length >= MAX_TAGS ? `Maximum of ${MAX_TAGS} tags reached` : ""}
                />
              )}
            />
          </Field>

          {/* Applied-level fields */}
          {showApplied && (
            <>
              <Box sx={addJobModalSx.grid2}>
                <Field label="Applied Date *">
                  <TextField
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    size="small"
                    sx={addJobModalSx.input}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ lang: "en" }}
                  />
                </Field>
                <Field label="Platform">
                  <Select value={platform} onChange={(e) => setPlatform(e.target.value)} size="small" sx={addJobModalSx.input} displayEmpty>
                    <MenuItem value="">— Select —</MenuItem>
                    {PLATFORMS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </Select>
                </Field>
              </Box>
              <Field label="Notes">
                <TextField
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes about this application..."
                  size="small"
                  multiline
                  minRows={2}
                  sx={addJobModalSx.input}
                />
              </Field>
            </>
          )}

          {/* Interviewing-level fields */}
          {showInterviewing && (
            <Box sx={addJobModalSx.grid2}>
              <Field label="Next Interview Date *">
                <TextField
                  type="date"
                  value={nextInterviewDate}
                  onChange={(e) => setNextInterviewDate(e.target.value)}
                  size="small"
                  sx={addJobModalSx.input}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ lang: "en" }}
                />
              </Field>
              <Field label="Round">
                <TextField value={round} onChange={(e) => setRound(e.target.value)} placeholder="e.g. HR Interview" size="small" sx={addJobModalSx.input} />
              </Field>
            </Box>
          )}

          {/* Offer-level fields */}
          {showOffer && (
            <Box sx={addJobModalSx.grid2}>
              <Field label="Answer Deadline">
                <TextField
                  type="date"
                  value={answerDeadline}
                  onChange={(e) => setAnswerDeadline(e.target.value)}
                  size="small"
                  sx={addJobModalSx.input}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ lang: "en" }}
                />
              </Field>
              <Field label="Offer Amount">
                <TextField value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} placeholder="e.g. 20,000 ₪" size="small" sx={addJobModalSx.input} />
              </Field>
            </Box>
          )}

          <Box sx={addJobModalSx.actions}>
            <Button type="button" onClick={() => { reset(); onClose(); }} sx={addJobModalSx.secondaryBtn}>
              Cancel
            </Button>
            <Button type="submit" sx={addJobModalSx.primaryBtn}>
              {isEditing ? "Save" : "Add"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <Box sx={addJobModalSx.field}>
      <Typography sx={addJobModalSx.label}>{label}</Typography>
      {children}
    </Box>
  );
}
