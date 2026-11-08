import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Field";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.username.trim()) next.username = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email, like name@example.com.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    setServerError("");
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await register({ username: form.username.trim(), email: form.email.trim(), password: form.password });
      toast.success("Account created. One more step: add your details.");
      navigate("/welcome", { replace: true });
    } catch (err) {
      // Show backend errors (like "email already exists") under the right field.
      const fieldErrors = {};
      ["username", "email", "password"].forEach((f) => { if (err.fields?.[f]) fieldErrors[f] = err.fields[f]; });
      if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
      else setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes less than a minute."
      footer={<>Already have an account? <Link to="/login">Log in</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="form">
        {serverError && <p className="alert alert--danger" role="alert">{serverError}</p>}
        <Input label="Name" autoComplete="name" value={form.username} onChange={set("username")} error={errors.username} />
        <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
        <div className="password-row">
          <Input
            label="Password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            hint="At least 8 characters."
          />
          <button type="button" className="icon-btn password-row__toggle" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <Button type="submit" icon={UserPlus} loading={loading}>Create account</Button>
      </form>
    </AuthLayout>
  );
}
