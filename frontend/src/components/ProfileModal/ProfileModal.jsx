import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useToast } from "../Toast/toastStore";
import avatar from "../../assets/avatar.png";

const load = (key, fallback = "") => {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
};

export default function ProfileModal({ open, onClose }) {
  const { addToast } = useToast();
  const fileRef = useRef(null);

  const [photo, setPhoto]       = useState(() => load("profilePhoto", ""));
  const [name, setName]         = useState(() => load("userName", ""));
  const [email, setEmail]       = useState(() => load("userEmail", ""));
  const [bio, setBio]           = useState(() => load("profileBio", ""));
  const [jobTitle, setJobTitle] = useState(() => load("profileJobTitle", ""));
  const [location, setLocation] = useState(() => load("profileLocation", ""));
  const [linkedin, setLinkedin] = useState(() => load("profileLinkedIn", ""));

  if (!open) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      localStorage.setItem("profilePhoto", ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("userName",        name);
    localStorage.setItem("userEmail",       email);
    localStorage.setItem("profileBio",      bio);
    localStorage.setItem("profileJobTitle", jobTitle);
    localStorage.setItem("profileLocation", location);
    localStorage.setItem("profileLinkedIn", linkedin);
    addToast("success", "Saved!", "Your profile has been updated");
    onClose();
  };

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

  return createPortal(
    <Box
      sx={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "grid", placeItems: "center", zIndex: 1000000, p: 2 }}
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <Box
        sx={{ width: "min(480px,100%)", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "20px", boxShadow: "var(--shadow)", overflow: "hidden" }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Box sx={{ px: 3, pt: 2.5, pb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
          <Typography sx={{ fontSize: 17, fontWeight: 800, color: "var(--text)" }}>My Profile</Typography>
          <Button onClick={onClose} sx={{ minWidth: 32, width: 32, height: 32, p: 0, borderRadius: "10px", border: "1px solid var(--border)", color: "var(--text)" }}>
            <CloseRoundedIcon fontSize="small" />
          </Button>
        </Box>

        <Box sx={{ px: 3, py: 2.5, display: "flex", flexDirection: "column", gap: 2, maxHeight: "75vh", overflowY: "auto" }}>

          {/* Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Box sx={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
              <Box
                component="img"
                src={photo || avatar}
                alt="Profile"
                sx={{ width: 72, height: 72, borderRadius: "18px", objectFit: "cover", border: "2px solid var(--border)" }}
              />
              <Box
                onClick={() => fileRef.current?.click()}
                sx={{ position: "absolute", bottom: -4, right: -4, width: 24, height: 24, borderRadius: "8px", background: "var(--primary)", display: "grid", placeItems: "center", cursor: "pointer", border: "2px solid var(--panel)" }}
              >
                <CameraAltOutlinedIcon sx={{ fontSize: 13, color: "#fff" }} />
              </Box>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>{name || "Your Name"}</Typography>
              <Typography sx={{ fontSize: 13, color: "var(--muted)", mt: 0.25 }}>{jobTitle || "Add your job title"}</Typography>
              <Button onClick={() => fileRef.current?.click()} sx={{ mt: 0.75, fontSize: 11, fontWeight: 700, textTransform: "none", color: "var(--primary)", p: 0, minWidth: 0 }}>
                Change photo
              </Button>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "var(--border)" }} />

          {/* Fields */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <PersonOutlinedIcon sx={{ fontSize: 13, color: "var(--muted)" }} />
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</Typography>
              </Box>
              <TextField value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" size="small" fullWidth sx={inputSx} />
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <EmailOutlinedIcon sx={{ fontSize: 13, color: "var(--muted)" }} />
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</Typography>
              </Box>
              <TextField value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" size="small" fullWidth sx={inputSx} />
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <WorkOutlineRoundedIcon sx={{ fontSize: 13, color: "var(--muted)" }} />
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Job Title</Typography>
              </Box>
              <TextField value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Frontend Developer" size="small" fullWidth sx={inputSx} />
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 13, color: "var(--muted)" }} />
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Location</Typography>
              </Box>
              <TextField value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Tel Aviv" size="small" fullWidth sx={inputSx} />
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
              <LinkedInIcon sx={{ fontSize: 13, color: "var(--muted)" }} />
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>LinkedIn</Typography>
            </Box>
            <TextField value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/yourname" size="small" fullWidth sx={inputSx} />
          </Box>

          <Box>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>Bio</Typography>
            <TextField
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself..."
              size="small"
              fullWidth
              multiline
              rows={3}
              sx={inputSx}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ px: 3, py: 2, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 1.25 }}>
          <Button onClick={onClose} sx={{ textTransform: "none", borderRadius: "10px", px: 2, fontWeight: 700, border: "1px solid var(--border)", color: "var(--text)" }}>
            Cancel
          </Button>
          <Button onClick={handleSave} sx={{ textTransform: "none", borderRadius: "10px", px: 2.5, fontWeight: 700, background: "var(--primary)", color: "#fff", "&:hover": { opacity: 0.88 } }}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}
