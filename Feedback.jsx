import { Loader2, WifiOff } from "lucide-react";
import { BoxArt } from "../Illustrations";
import Button from "./Button";

export function Spinner({ label = "Loading" }) {
  return (
    <div className="center-block" role="status">
      <Loader2 className="spin" size={28} />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function FullPageLoader() {
  return <div className="fullpage"><Spinner /></div>;
}

export function Skeleton({ height = 96, count = 1 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="skeleton" style={{ height }} aria-hidden="true" />
  ));
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="empty">
      <BoxArt size={150} />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="empty">
      <WifiOff size={40} />
      <h3>Couldn't load this page</h3>
      <p>{message}</p>
      {onRetry && <Button variant="dark" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
