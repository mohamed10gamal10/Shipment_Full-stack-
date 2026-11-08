import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Input, Select } from "../components/ui/Field";
import Button from "../components/ui/Button";
import Page from "../components/Page";
import { Logo } from "../components/Illustrations";
import { customerApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { GENDERS } from "../lib/constants";

// Customers must fill this once before they can create shipments.
export default function Welcome() {
  const { user, profile, setProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user.username || "", phone: "", sameWhatsapp: true, whatsapp_number: "",
    gender: "", birthday: "", address: "", city: "", country: "Egypt",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  if (user.role !== "customer" || profile) return <Navigate to="/dashboard" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your full name.";
    if (!/^\+?[0-9 ]{7,16}$/.test(form.phone.trim())) e.phone = "Enter a phone number with 7 to 16 digits.";
    if (!form.sameWhatsapp && form.whatsapp_number.trim().length > 16) e.whatsapp_number = "Use 16 characters or fewer.";
    if (!form.gender) e.gender = "Choose one.";
    if (!form.address.trim()) e.address = "Enter your street address.";
    if (!form.city.trim()) e.city = "Enter your city.";
    if (!form.country.trim()) e.country = "Enter your country.";
    return e;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setServerError("");
    if (Object.keys(e).length) return;

    const body = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      whatsapp_number: form.sameWhatsapp ? form.phone.trim() : form.whatsapp_number.trim(),
      gender: form.gender,
      address: form.address.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
    };
    if (form.birthday) body.birthday = form.birthday;

    setLoading(true);
    try {
      const created = await customerApi.create(body);
      setProfile(created);
      toast.success("Details saved. You can create your first shipment now.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const fe = {};
      Object.keys(body).forEach((k) => { if (err.fields?.[k]) fe[k] = err.fields[k]; });
      if (Object.keys(fe).length) setErrors(fe);
      else setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="welcome">
      <header className="welcome__bar"><Logo /><Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }}>Log out</Button></header>
      <Page className="welcome__box">
        <h1>Tell us how to reach you</h1>
        <p className="muted">We use these details on your shipments. You only do this once.</p>

        <form onSubmit={onSubmit} noValidate className="form">
          {serverError && <p className="alert alert--danger" role="alert">{serverError}</p>}

          <fieldset className="form__group">
            <legend>About you</legend>
            <Input label="Full name" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
            <div className="form__row">
              <Select label="Gender" placeholder="Choose" options={GENDERS} value={form.gender} onChange={set("gender")} error={errors.gender} />
              <Input label="Birthday (optional)" type="date" value={form.birthday} onChange={set("birthday")} error={errors.birthday} />
            </div>
          </fieldset>

          <fieldset className="form__group">
            <legend>Phone</legend>
            <Input label="Phone number" type="tel" autoComplete="tel" placeholder="+201000000000" value={form.phone} onChange={set("phone")} error={errors.phone} />
            <label className="check">
              <input type="checkbox" checked={form.sameWhatsapp} onChange={(e) => setForm({ ...form, sameWhatsapp: e.target.checked })} />
              <span className="check__box"><Check size={14} strokeWidth={3} /></span>
              WhatsApp number is the same
            </label>
            {!form.sameWhatsapp && (
              <Input label="WhatsApp number" type="tel" value={form.whatsapp_number} onChange={set("whatsapp_number")} error={errors.whatsapp_number} />
            )}
          </fieldset>

          <fieldset className="form__group">
            <legend>Address</legend>
            <Input label="Street address" autoComplete="street-address" value={form.address} onChange={set("address")} error={errors.address} />
            <div className="form__row">
              <Input label="City" autoComplete="address-level2" value={form.city} onChange={set("city")} error={errors.city} />
              <Input label="Country" autoComplete="country-name" value={form.country} onChange={set("country")} error={errors.country} />
            </div>
          </fieldset>

          <Button type="submit" loading={loading}>Save and continue</Button>
        </form>
      </Page>
    </div>
  );
}
