import { STATUS } from "../../lib/constants";

export default function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, color: "var(--st-created)" };
  return (
    <span className="badge" style={{ "--c": s.color }}>
      <i className="badge__dot" />
      {s.label}
    </span>
  );
}
