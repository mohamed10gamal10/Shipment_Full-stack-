import { Loader2 } from "lucide-react";

// variant: primary | dark | ghost | danger     size: md | sm
// Use as={Link} to="/somewhere" to get a button-looking link.
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  as: Tag = "button",
  className = "",
  children,
  disabled,
  ...rest
}) {
  const isButton = Tag === "button";
  const extra = isButton ? { type: rest.type || "button", disabled: disabled || loading } : {};
  return (
    <Tag className={`btn btn--${variant} btn--${size} ${className}`} aria-busy={loading || undefined} {...extra} {...rest}>
      {loading ? <Loader2 size={18} className="spin" /> : Icon && <Icon size={18} />}
      <span>{children}</span>
      {!loading && IconRight && <IconRight size={18} />}
    </Tag>
  );
}
