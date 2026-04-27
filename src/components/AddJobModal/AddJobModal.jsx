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

const PRESET_TAGS = [
  "React", "Vue", "Angular", "JavaScript", "TypeScript",
  "Node", "Python", "Java", "SQL", "MongoDB",
  "CSS", "HTML", "Git", "Docker", "AWS",
  "GraphQL", "REST", "Redux", "Next.js", "Figma",
];

const MAX_TAGS = 5;

export default function AddJobModal({ open, onClose, onAdd, defaultStatus }) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState(defaultStatus ?? STATUSES[0]);
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("hybrid");
  const [tags, setTags] = useState([]);
  const [jobUrl, setJobUrl] = useState("");

  if (!open) return null;

  const reset = () => {
    setCompanyName("");
    setJobTitle("");
    setStatus(defaultStatus ?? STATUSES[0]);
    setLocation("");
    setWorkType("hybrid");
    setTags([]);
    setJobUrl("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedCompany = companyName.trim();
    const trimmedTitle = jobTitle.trim();
    if (!trimmedCompany || !trimmedTitle) return;

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
    <Modal open={open} onClose={onClose}>
      <Box onClick={onClose} sx={addJobModalSx.overlay}>
        <Box component="form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} sx={addJobModalSx.card}>
          <Box sx={addJobModalSx.header}>
            <Typography sx={addJobModalSx.title}>Add Job</Typography>
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
            <TextField
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Check Point"
              size="small"
              sx={addJobModalSx.input}
            />
          </Field>

          <Box sx={addJobModalSx.grid2}>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)} size="small" sx={addJobModalSx.input}>
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
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
              onChange={(_, newValue) => {
                if (newValue.length <= MAX_TAGS) setTags(newValue);
              }}
              freeSolo
              size="small"
              getOptionDisabled={() => tags.length >= MAX_TAGS}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option}
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                    sx={{ fontSize: 11 }}
                  />
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

          <Box sx={addJobModalSx.actions}>
            <Button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              sx={addJobModalSx.secondaryBtn}
            >
              Cancel
            </Button>
            <Button type="submit" sx={addJobModalSx.primaryBtn}>
              Add
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
