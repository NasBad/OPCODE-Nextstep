import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { register } from "../api/auth.api";
import { authPageSx } from "./AuthPage.styles";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user?.name || name);
      navigate("/dashboard", { replace: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ name, email, password });
  };

  const errorMsg = error?.response?.data?.message || error?.message;

  return (
    <Box sx={authPageSx.root}>
      <Box component="form" onSubmit={handleSubmit} sx={authPageSx.card} autoComplete="off">
        <Typography sx={authPageSx.title}>Create your account</Typography>
        <Typography sx={authPageSx.subtitle}>Start tracking your job applications</Typography>

        {errorMsg && (
          <Alert severity="error" sx={authPageSx.alert}>
            {errorMsg}
          </Alert>
        )}

        <Box sx={authPageSx.field}>
          <Typography sx={authPageSx.label}>Name</Typography>
          <TextField
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            size="small"
            required
            fullWidth
            sx={authPageSx.input}
          />
        </Box>

        <Box sx={authPageSx.field}>
          <Typography sx={authPageSx.label}>Email</Typography>
          <TextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            size="small"
            required
            fullWidth
            sx={authPageSx.input}
          />
        </Box>

        <Box sx={authPageSx.field}>
          <Typography sx={authPageSx.label}>Password</Typography>
          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            size="small"
            required
            fullWidth
            sx={authPageSx.input}
          />
        </Box>

        <Button type="submit" disabled={isPending} fullWidth sx={authPageSx.submitBtn}>
          {isPending ? "Creating account..." : "Create Account"}
        </Button>

        <Typography sx={authPageSx.footer}>
          Already have an account?{" "}
          <Box component={Link} to="/login" sx={authPageSx.link}>
            Sign in
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
