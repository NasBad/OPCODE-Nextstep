import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { login } from "../api/auth.api";
import { authPageSx } from "./AuthPage.styles";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/dashboard", { replace: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  const errorMsg = error?.response?.data?.message || error?.message;

  return (
    <Box sx={authPageSx.root}>
      <Box component="form" onSubmit={handleSubmit} sx={authPageSx.card}>
        <Typography sx={authPageSx.title}>Welcome back</Typography>
        <Typography sx={authPageSx.subtitle}>Sign in to your account</Typography>

        {errorMsg && (
          <Alert severity="error" sx={authPageSx.alert}>
            {errorMsg}
          </Alert>
        )}

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
          {isPending ? "Signing in..." : "Sign In"}
        </Button>

        <Typography sx={authPageSx.footer}>
          Don&apos;t have an account?{" "}
          <Box component={Link} to="/register" sx={authPageSx.link}>
            Sign up
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
