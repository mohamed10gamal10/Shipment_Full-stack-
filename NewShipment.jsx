import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Plus, Send, Trash2 } from "lucide-react";
import Page from "../components/Page";
import Button from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/Field";
import { shipmentApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ITEM_TYPES } from "../lib/constants";
import { formatMoney, shipmentTotal } from "../lib/format";

const STEPS = ["Route", "Items", "Review"];

let counter = 0;
const newItem = () => ({ key: ++counter, name: "", type: "", quantity: "1", price: "", description: "" });

export default function NewShipment() {
  const { profile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState({
    name: "", description: "",
    address_source: profile?.address || "", city_source: profile?.city || "",
    address_destination: "", city_destination: "", state_destination: "",
  });
  const [items, setItems] = useState([newItem()]);
  const [errors, setErrors] = useState({});
  const [itemErrors, setItemErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setItem = (key, field) => (e) =>
    setItems(items.map((it) => (it.key === key ? { ...it, [field]: e.target.value } : it)));

  function validateRoute() {
    const required = {
      name: "Give the shipment a name.",
      address_source: "Enter the pickup address.",
      city_source: "Enter the pickup city.",
      address_destination: "Enter the delivery address.",
      city_destination: "Enter the delivery city.",
      state_destination: "Enter the delivery state or governorate.",
    };
    const e = {};
    Object.entries(required).forEach(([k, msg]) => { if (!form[k].trim()) e[k] = msg; });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateItems() {
    const all = {};
    items.forEach((it) => {
      const e = {};
      if (!it.name.trim()) e.name = "Enter the item name.";
      if (!it.type) e.type = "Choose a type.";
      if (!Number.isInteger(Number(it.quantity)) || Number(it.quantity) < 1) e.quantity = "Use a whole number, 1 or more.";
      if (it.price === "" || Number(it.price) < 0 || Number.isNaN(Number(it.price))) e.price = "Enter the price in EGP.";
      if (Object.keys(e).length) all[it.key] = e;
    });
    setItemErrors(all);
    return Object.keys(all).length === 0;
  }

  function go(next) {
    setDir(next > step ? 1 : -1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onNext() {
    if (step === 0 && !validateRoute()) return;
    if (step === 1 && !validateItems()) return;
    go(step + 1);
  }

  async function onSubmit() {
    setLoading(true);
    setServerError("");
    const body = {
      ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()])),
      items: items.map((it) => ({
        name: it.name.trim(),
        type: it.type,
        quantity: Number(it.quantity),
        price: Number(it.price).toFixed(2),
        description: it.description.trim(),
      })),
    };
    try {
      const created = await shipmentApi.create(body);
      toast.success("Shipment created.");
      navigate(`/shipments/${created.id}`, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const total = shipmentTotal(items);

  return (
    <Page>
      <Link to="/dashboard" className="back"><ArrowLeft size={18} /> All shipments</Link>
      <div className="page-head"><h1>New shipment</h1></div>

      <ol className="stepper" aria-label="Steps">
        {STEPS.map((label, i) => (
          <li key={label} className={`stepper__step ${i === step ? "is-current" : ""} ${i < step ? "is-done" : ""}`} aria-current={i === step ? "step" : undefined}>
            <span className="stepper__dot">{i < step ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      <div className="panel wizard">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 36 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -36 * dir }}
            transition={{ duration: 0.22 }}
          >
            {step === 0 && (
              <div className="form">
                <Input label="Shipment name" placeholder="For example: Laptop for Ahmed" value={form.name} onChange={set("name")} error={errors.name} />
                <Textarea label="Notes (optional)" placeholder="Anything the courier should know, like “handle with care”" value={form.description} onChange={set("description")} />

                <fieldset className="form__group">
                  <legend>Pick up from</legend>
                  <Input label="Address" value={form.address_source} onChange={set("address_source")} error={errors.address_source} />
                  <Input label="City" value={form.city_source} onChange={set("city_source")} error={errors.city_source} />
                </fieldset>

                <fieldset className="form__group">
                  <legend>Deliver to</legend>
                  <Input label="Address" value={form.address_destination} onChange={set("address_destination")} error={errors.address_destination} />
                  <div className="form__row">
                    <Input label="City" value={form.city_destination} onChange={set("city_destination")} error={errors.city_destination} />
                    <Input label="State or governorate" value={form.state_destination} onChange={set("state_destination")} error={errors.state_destination} />
                  </div>
                </fieldset>
              </div>
            )}

            {step === 1 && (
              <div className="form">
                <AnimatePresence initial={false}>
                  {items.map((it, i) => {
                    const e = itemErrors[it.key] || {};
                    return (
                      <motion.fieldset
                        key={it.key}
                        className="form__group item"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <legend>Item {i + 1}</legend>
                        <div className="form__row">
                          <Input label="Name" value={it.name} onChange={setItem(it.key, "name")} error={e.name} />
                          <Select label="Type" placeholder="Choose" options={ITEM_TYPES} value={it.type} onChange={setItem(it.key, "type")} error={e.type} />
                        </div>
                        <div className="form__row">
                          <Input label="Quantity" type="number" min="1" step="1" inputMode="numeric" value={it.quantity} onChange={setItem(it.key, "quantity")} error={e.quantity} />
                          <Input label="Price each (EGP)" type="number" min="0" step="0.01" inputMode="decimal" value={it.price} onChange={setItem(it.key, "price")} error={e.price} />
                        </div>
                        <Input label="Description (optional)" value={it.description} onChange={setItem(it.key, "description")} />
                        {items.length > 1 && (
                          <Button variant="ghost" size="sm" icon={Trash2} onClick={() => setItems(items.filter((x) => x.key !== it.key))}>
                            Remove item {i + 1}
                          </Button>
                        )}
                      </motion.fieldset>
                    );
                  })}
                </AnimatePresence>
                <Button variant="ghost" icon={Plus} onClick={() => setItems([...items, newItem()])}>Add another item</Button>
                <p className="total">Total value <strong>{formatMoney(total)}</strong></p>
              </div>
            )}

            {step === 2 && (
              <div className="review">
                <h2>{form.name}</h2>
                {form.description && <p className="muted">{form.description}</p>}
                <div className="review__route">
                  <div><p className="route__label">Pick up from</p><p><strong>{form.city_source}</strong></p><p className="muted">{form.address_source}</p></div>
                  <div><p className="route__label">Deliver to</p><p><strong>{form.city_destination}</strong></p><p className="muted">{form.address_destination}, {form.state_destination}</p></div>
                </div>
                <ul className="review__items">
                  {items.map((it) => (
                    <li key={it.key}>
                      <span>{it.quantity} × {it.name}</span>
                      <span>{formatMoney(Number(it.price) * Number(it.quantity))}</span>
                    </li>
                  ))}
                </ul>
                <p className="total">Total value <strong>{formatMoney(total)}</strong></p>
                {serverError && <p className="alert alert--danger" role="alert">{serverError}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="wizard__nav">
          {step > 0 ? <Button variant="ghost" icon={ArrowLeft} onClick={() => go(step - 1)}>Back</Button> : <span />}
          {step < STEPS.length - 1 ? (
            <Button iconRight={ArrowRight} onClick={onNext}>{step === 0 ? "Next: add items" : "Next: review"}</Button>
          ) : (
            <Button icon={Send} loading={loading} onClick={onSubmit}>Create shipment</Button>
          )}
        </div>
      </div>
    </Page>
  );
}
