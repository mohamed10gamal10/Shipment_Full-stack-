import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.email.trim()) next.email = "Enter your email.";
    if (!form.password) next.password = "Enter your password.";
    setErrors(next);
    setServerError("");
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      toast.success("Welcome back!");
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setServerError(err.status === 401 ? "Email or password is wrong. Check them and try again." : err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Log in"
      subtitle="Pick up where you left off."
      footer={<>New here? <Link to="/register">Create an account</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="form">
        {serverError && <p className="alert alert--danger" role="alert">{serverError}</p>}
        <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
        <Input label="Password" type="password" autoComplete="current-password" value={form.password} onChange={set("password")} error={errors.password} />
        <Button type="submit" icon={LogIn} loading={loading}>Log in</Button>
      </form>
    </AuthLayout>
  );
}
