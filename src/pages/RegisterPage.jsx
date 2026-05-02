import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Link, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage({ onGoLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "var(--bg)" }}>
      <Paper sx={{ p: 4, width: 380, borderRadius: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
        <Typography variant="h5" fontWeight={700} mb={0.5} color="var(--text)">
          Create your account
        </Typography>
        <Typography variant="body2" color="var(--muted)" mb={3}>
          Start tracking your job applications
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            helperText="At least 6 characters"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 1, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Create account"}
          </Button>
        </Box>

        <Typography variant="body2" textAlign="center" mt={2.5} color="var(--muted)">
          Already have an account?{" "}
          <Link component="button" onClick={onGoLogin} underline="hover" fontWeight={600}>
            Log in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
