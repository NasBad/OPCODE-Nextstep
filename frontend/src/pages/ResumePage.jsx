import { useMemo, useState } from "react";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const field = (label, value, onChange, placeholder = "") => (
  <Box>
    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {label}
    </Typography>
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size="small"
      fullWidth
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          background: "var(--panel-2)",
          fontSize: 13,
          "& fieldset": { borderColor: "var(--border)" },
          "&:hover fieldset": { borderColor: "var(--primary)" },
        },
        "& input": { color: "var(--text)", py: "8px" },
      }}
    />
  </Box>
);

export default function ResumePage({ jobs = [] }) {
  const [info, setInfo] = useState(() => {
    try { return JSON.parse(localStorage.getItem("resumeInfo")) || {}; } catch { return {}; }
  });
  const [edu, setEdu] = useState(() => {
    try { return JSON.parse(localStorage.getItem("resumeEdu")) || {}; } catch { return {}; }
  });

  const updateInfo = (key, val) => {
    const next = { ...info, [key]: val };
    setInfo(next);
    localStorage.setItem("resumeInfo", JSON.stringify(next));
  };
  const updateEdu = (key, val) => {
    const next = { ...edu, [key]: val };
    setEdu(next);
    localStorage.setItem("resumeEdu", JSON.stringify(next));
  };

  const name     = info.name     || localStorage.getItem("userName") || "";
  const email    = info.email    || "";
  const phone    = info.phone    || "";
  const linkedin = info.linkedin || "";
  const github   = info.github   || "";

  const skills = useMemo(() => {
    const all = jobs.flatMap((j) => j.tags || []);
    return [...new Set(all)];
  }, [jobs]);

  const experience = useMemo(() =>
    jobs
      .filter((j) => j.status !== "Wishlist" && !j.isDeleted)
      .sort((a, b) => new Date(b.appliedDate || b.createdAt) - new Date(a.appliedDate || a.createdAt)),
    [jobs]
  );

  const handleExport = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #resume-preview, #resume-preview * { visibility: visible !important; }
          #resume-preview {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            background: white !important;
            padding: 40px !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      <Box sx={{ p: 3, display: "flex", gap: 3, height: "100%", minHeight: 0, overflow: "auto" }}>

        {/* ── Left: Form ── */}
        <Box sx={{ flex: "0 0 300px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", pr: 0.5 }}>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>Resume Builder</Typography>
            <Button
              onClick={handleExport}
              startIcon={<DownloadOutlinedIcon />}
              sx={{ fontSize: 12, fontWeight: 600, background: "var(--primary)", color: "#fff", borderRadius: "8px", px: 1.5, py: 0.75, textTransform: "none", "&:hover": { opacity: 0.88 } }}
            >
              Export PDF
            </Button>
          </Box>

          <Box sx={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "12px", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Personal Info</Typography>
            {field("Full Name", name, (v) => updateInfo("name", v), "Your full name")}
            {field("Email", email, (v) => updateInfo("email", v), "you@example.com")}
            {field("Phone", phone, (v) => updateInfo("phone", v), "+972 50 000 0000")}
            {field("LinkedIn", linkedin, (v) => updateInfo("linkedin", v), "linkedin.com/in/yourname")}
            {field("GitHub", github, (v) => updateInfo("github", v), "github.com/yourname")}
          </Box>

          <Box sx={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "12px", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Education</Typography>
            {field("School / University", edu.school || "", (v) => updateEdu("school", v), "e.g. Tel Aviv University")}
            {field("Degree", edu.degree || "", (v) => updateEdu("degree", v), "e.g. B.Sc Computer Science")}
            {field("Graduation Year", edu.year || "", (v) => updateEdu("year", v), "e.g. 2025")}
          </Box>

          <Box sx={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "12px", p: 2 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", mb: 1 }}>Skills (auto from your jobs)</Typography>
            {skills.length === 0 ? (
              <Typography sx={{ fontSize: 12, color: "var(--muted)" }}>No tags found — add tags to your jobs</Typography>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {skills.map((s) => (
                  <Box key={s} sx={{ fontSize: 11, fontWeight: 600, px: 1.25, py: 0.4, borderRadius: "6px", background: "var(--primary-weak)", color: "var(--primary)", border: "1px solid var(--primary-weak)" }}>
                    {s}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "12px", p: 2 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5 }}>Experience (auto from your jobs)</Typography>
            <Typography sx={{ fontSize: 11, color: "var(--muted)", mb: 1 }}>Pulled from Applied, Interviewing & Offer</Typography>
            {experience.length === 0 ? (
              <Typography sx={{ fontSize: 12, color: "var(--muted)" }}>No experience found — add jobs with Applied or higher status</Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                {experience.map((j) => (
                  <Box key={j.id} sx={{ fontSize: 12, color: "var(--text)", py: 0.5, borderLeft: "2px solid var(--primary)", pl: 1 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{j.jobTitle}</Typography>
                    <Typography sx={{ fontSize: 11, color: "var(--muted)" }}>{j.companyName} · {j.appliedDate || j.createdAt?.slice(0, 10)}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Right: Preview ── */}
        <Box
          id="resume-preview"
          sx={{
            flex: 1,
            background: "#ffffff",
            borderRadius: "14px",
            p: "36px 40px",
            overflowY: "auto",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            color: "#111",
            minWidth: 0,
          }}
        >
          {/* Header */}
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

          {/* Skills */}
          {skills.length > 0 && (
            <>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.08em", mb: 1 }}>Skills</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2.5 }}>
                {skills.map((s) => (
                  <Box key={s} sx={{ fontSize: 11, fontWeight: 600, px: 1.25, py: 0.4, borderRadius: "5px", background: "#f0f4ff", color: "#2563eb", border: "1px solid #dbeafe" }}>
                    {s}
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.08em", mb: 1.5 }}>Experience</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2.5 }}>
                {experience.map((j) => (
                  <Box key={j.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{j.jobTitle}</Typography>
                        <Typography sx={{ fontSize: 12, color: "#64748b" }}>{j.companyName}{j.location ? ` · ${j.location}` : ""}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", ml: 1 }}>
                        {j.appliedDate || j.createdAt?.slice(0, 10)}
                      </Typography>
                    </Box>
                    {j.workType && (
                      <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.25 }}>{j.workType}</Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* Education */}
          {(edu.school || edu.degree) && (
            <>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.08em", mb: 1.5 }}>Education</Typography>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{edu.school}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#64748b" }}>{edu.degree}</Typography>
                  </Box>
                  {edu.year && <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>{edu.year}</Typography>}
                </Box>
              </Box>
            </>
          )}

          {!name && !email && skills.length === 0 && experience.length === 0 && (
            <Typography sx={{ fontSize: 13, color: "#94a3b8", textAlign: "center", mt: 6 }}>
              Fill in the form on the left to build your resume
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}
