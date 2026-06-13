import { useState } from "react";
import { Box, Button, Divider, IconButton, TextField, Typography } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    background: "var(--panel-2)",
    color: "var(--text)",
    fontSize: 13,
    "& fieldset": { borderColor: "var(--border)" },
    "&:hover fieldset": { borderColor: "var(--primary)" },
    "&.Mui-focused fieldset": { borderColor: "var(--primary)" },
  },
  "& input, & textarea": { color: "var(--text)" },
};

function SectionLabel({ children }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.75 }}>
      {children}
    </Typography>
  );
}

function FormCard({ children }) {
  return (
    <Box sx={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "12px", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
      {children}
    </Box>
  );
}

export default function ResumePage() {
  const [info, setInfo] = useState(() => load("resumeInfo", {}));
  const [edu, setEdu]   = useState(() => load("resumeEdu",  {}));
  const [skills, setSkills]   = useState(() => load("resumeSkills", []));
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState(() => load("resumeExp", []));

  const updateInfo = (key, val) => { const n = { ...info, [key]: val }; setInfo(n); save("resumeInfo", n); };
  const updateEdu  = (key, val) => { const n = { ...edu,  [key]: val }; setEdu(n);  save("resumeEdu",  n); };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || skills.includes(s)) return;
    const n = [...skills, s]; setSkills(n); save("resumeSkills", n); setSkillInput("");
  };
  const removeSkill = (s) => { const n = skills.filter((x) => x !== s); setSkills(n); save("resumeSkills", n); };

  const addExp = () => {
    const n = [...experience, { id: Date.now(), company: "", title: "", date: "", desc: "" }];
    setExperience(n); save("resumeExp", n);
  };
  const updateExp = (id, key, val) => {
    const n = experience.map((e) => e.id === id ? { ...e, [key]: val } : e);
    setExperience(n); save("resumeExp", n);
  };
  const removeExp = (id) => { const n = experience.filter((e) => e.id !== id); setExperience(n); save("resumeExp", n); };

  const name     = info.name     || "";
  const email    = info.email    || "";
  const phone    = info.phone    || "";
  const linkedin = info.linkedin || "";
  const github   = info.github   || "";

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #resume-preview, #resume-preview * { visibility: visible !important; }
          #resume-preview { position: fixed !important; inset: 0 !important; width: 100vw !important; background: white !important; padding: 40px !important; box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>

      <Box sx={{ p: 3, display: "flex", gap: 3, height: "100%", minHeight: 0, overflow: "auto" }}>

        {/* ── Left: Form ── */}
        <Box sx={{ flex: "0 0 320px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", pr: 0.5 }}>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Resume Builder</Typography>
            <Button onClick={() => window.print()} startIcon={<DownloadOutlinedIcon />}
              sx={{ fontSize: 12, fontWeight: 600, background: "var(--primary)", color: "#fff", borderRadius: "8px", px: 1.5, py: 0.75, textTransform: "none", "&:hover": { opacity: 0.88 } }}>
              Export PDF
            </Button>
          </Box>

          {/* Personal Info */}
          <FormCard>
            <SectionLabel>Personal Info</SectionLabel>
            {[
              ["Full Name", "name", "Your full name"],
              ["Email", "email", "you@example.com"],
              ["Phone", "phone", "+972 50 000 0000"],
              ["LinkedIn", "linkedin", "linkedin.com/in/yourname"],
              ["GitHub", "github", "github.com/yourname"],
            ].map(([label, key, ph]) => (
              <Box key={key}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", mb: 0.5 }}>{label}</Typography>
                <TextField value={info[key] || ""} onChange={(e) => updateInfo(key, e.target.value)} placeholder={ph} size="small" fullWidth sx={inputSx} />
              </Box>
            ))}
          </FormCard>

          {/* Skills */}
          <FormCard>
            <SectionLabel>Skills</SectionLabel>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="e.g. React"
                size="small"
                fullWidth
                sx={inputSx}
              />
              <Button onClick={addSkill} sx={{ minWidth: 36, width: 36, height: 36, p: 0, borderRadius: "8px", background: "var(--primary)", color: "#fff", flexShrink: 0 }}>
                <AddRoundedIcon fontSize="small" />
              </Button>
            </Box>
            {skills.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {skills.map((s) => (
                  <Box key={s} sx={{ display: "flex", alignItems: "center", gap: 0.4, fontSize: 11, fontWeight: 600, px: 1, py: 0.4, borderRadius: "6px", background: "var(--primary-weak)", color: "var(--primary)", border: "1px solid var(--primary-weak)" }}>
                    {s}
                    <Box component="span" onClick={() => removeSkill(s)} sx={{ cursor: "pointer", fontSize: 13, lineHeight: 1, ml: 0.25, opacity: 0.6, "&:hover": { opacity: 1 } }}>×</Box>
                  </Box>
                ))}
              </Box>
            )}
          </FormCard>

          {/* Experience */}
          <FormCard>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SectionLabel>Experience</SectionLabel>
              <Button onClick={addExp} startIcon={<AddRoundedIcon />}
                sx={{ fontSize: 11, fontWeight: 700, textTransform: "none", color: "var(--primary)", p: 0, minWidth: 0 }}>
                Add
              </Button>
            </Box>
            {experience.length === 0 && (
              <Typography sx={{ fontSize: 12, color: "var(--muted)" }}>Click Add to add a job experience</Typography>
            )}
            {experience.map((exp) => (
              <Box key={exp.id} sx={{ p: 1.25, borderRadius: "8px", border: "1px solid var(--border)", background: "var(--panel-2)", display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>Experience Entry</Typography>
                  <IconButton onClick={() => removeExp(exp.id)} size="small" sx={{ color: "#b00020" }}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
                {[
                  ["Company", "company", "e.g. Google"],
                  ["Job Title", "title", "e.g. Frontend Developer"],
                  ["Date / Period", "date", "e.g. Jan 2025 – Present"],
                ].map(([label, key, ph]) => (
                  <Box key={key}>
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", mb: 0.4 }}>{label}</Typography>
                    <TextField value={exp[key]} onChange={(e) => updateExp(exp.id, key, e.target.value)} placeholder={ph} size="small" fullWidth sx={inputSx} />
                  </Box>
                ))}
                <Box>
                  <Typography sx={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", mb: 0.4 }}>Description (optional)</Typography>
                  <TextField value={exp.desc} onChange={(e) => updateExp(exp.id, "desc", e.target.value)} placeholder="What did you do?" size="small" fullWidth multiline rows={2} sx={inputSx} />
                </Box>
              </Box>
            ))}
          </FormCard>

          {/* Education */}
          <FormCard>
            <SectionLabel>Education</SectionLabel>
            {[
              ["School / University", "school", "e.g. Tel Aviv University"],
              ["Degree", "degree", "e.g. B.Sc Computer Science"],
              ["Graduation Year", "year", "e.g. 2025"],
            ].map(([label, key, ph]) => (
              <Box key={key}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", mb: 0.5 }}>{label}</Typography>
                <TextField value={edu[key] || ""} onChange={(e) => updateEdu(key, e.target.value)} placeholder={ph} size="small" fullWidth sx={inputSx} />
              </Box>
            ))}
          </FormCard>
        </Box>

        {/* ── Right: Preview ── */}
        <Box id="resume-preview" sx={{ flex: 1, background: "#ffffff", borderRadius: "14px", p: "36px 40px", overflowY: "auto", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", color: "#111", minWidth: 0 }}>

          <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
            {name || "Your Name"}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1, mb: 0.5 }}>
            {email    && <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 12, color: "#555" }}><EmailOutlinedIcon sx={{ fontSize: 14 }} />{email}</Box>}
            {phone    && <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 12, color: "#555" }}><PhoneOutlinedIcon sx={{ fontSize: 14 }} />{phone}</Box>}
            {linkedin && <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 12, color: "#2563eb" }}><LinkedInIcon sx={{ fontSize: 14 }} />{linkedin}</Box>}
            {github   && <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 12, color: "#333" }}><GitHubIcon sx={{ fontSize: 14 }} />{github}</Box>}
          </Box>

          <Divider sx={{ my: 2, borderColor: "#e2e8f0" }} />

          {skills.length > 0 && (
            <>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.08em", mb: 1 }}>Skills</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2.5 }}>
                {skills.map((s) => (
                  <Box key={s} sx={{ fontSize: 11, fontWeight: 600, px: 1.25, py: 0.4, borderRadius: "5px", background: "#f0f4ff", color: "#2563eb", border: "1px solid #dbeafe" }}>{s}</Box>
                ))}
              </Box>
            </>
          )}

          {experience.length > 0 && (
            <>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.08em", mb: 1.5 }}>Experience</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2.5 }}>
                {experience.map((exp) => (
                  <Box key={exp.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{exp.title || "Job Title"}</Typography>
                        <Typography sx={{ fontSize: 12, color: "#64748b" }}>{exp.company || "Company"}</Typography>
                      </Box>
                      {exp.date && <Typography sx={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", ml: 1 }}>{exp.date}</Typography>}
                    </Box>
                    {exp.desc && <Typography sx={{ fontSize: 12, color: "#475569", mt: 0.5 }}>{exp.desc}</Typography>}
                  </Box>
                ))}
              </Box>
            </>
          )}

          {(edu.school || edu.degree) && (
            <>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.08em", mb: 1.5 }}>Education</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{edu.school}</Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b" }}>{edu.degree}</Typography>
                </Box>
                {edu.year && <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>{edu.year}</Typography>}
              </Box>
            </>
          )}

          {!name && skills.length === 0 && experience.length === 0 && (
            <Typography sx={{ fontSize: 13, color: "#94a3b8", textAlign: "center", mt: 6 }}>
              Fill in the form on the left to build your resume
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}
