import { useId } from "react";

function Wrapper({ id, label, error, hint, children }) {
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <p className="field__msg field__msg--error" id={`${id}-msg`}>{error}</p>
             : hint ? <p className="field__msg" id={`${id}-msg`}>{hint}</p> : null}
    </div>
  );
}

export function Input({ label, error, hint, ...props }) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <input id={id} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-msg` : undefined} {...props} />
    </Wrapper>
  );
}

export function Textarea({ label, error, hint, ...props }) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <textarea id={id} rows={3} aria-invalid={!!error} {...props} />
    </Wrapper>
  );
}

export function Select({ label, error, hint, options, placeholder, ...props }) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <select id={id} aria-invalid={!!error} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Wrapper>
  );
}
