import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    homepage: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");

  const [token, setToken] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (error) setError("");
  };

  const handleHomepageBlur = (e) => {
    let url = e.target.value.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      url = "http://" + url;
      setForm((f) => ({ ...f, homepage: url }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { username, email, homepage, password } = form;
      await register({ username, email, homepage, password, recaptcha_token: token });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        height: "auto",
        mx: "auto",
        p: 4,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Register
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          name="username"
          label="Username"
          fullWidth
          margin="normal"
          value={form.username}
          onChange={handleChange}
          required
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextField
          name="homepage"
          label="Homepage"
          type="text"
          fullWidth
          margin="normal"
          value={form.homepage}
          onChange={handleChange}
          onBlur={handleHomepageBlur}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
          required
        />
        <TextField
          name="repeatPassword"
          label="Repeat Password"
          type="password"
          fullWidth
          margin="normal"
          value={form.repeatPassword}
          onChange={handleChange}
          required
          error={Boolean(error && form.password !== form.repeatPassword)}
          helperText={
            form.repeatPassword && form.password !== form.repeatPassword
              ? "Passwords must match"
              : ""
          }
        />
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={setToken}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!token}
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </form>

      <Box mt={2} textAlign="center">
        <Link to="/login">Already have an account? Log in</Link>
      </Box>
    </Box>
  );
}
