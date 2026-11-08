import { motion } from "framer-motion";
import { Ban, Check } from "lucide-react";
import { JOURNEY, STATUS } from "../lib/constants";

export default function StatusTimeline({ status }) {
  const cancelled = status === "cancelled";
  const current = cancelled ? -1 : JOURNEY.indexOf(status);
  const progress = current <= 0 ? 0 : current / (JOURNEY.length - 1);

  return (
    <div>
      {cancelled && (
        <p className="alert alert--danger">
          <Ban size={20} /> This shipment was cancelled and will not be delivered.
        </p>
      )}
      <div className={`timeline ${cancelled ? "is-cancelled" : ""}`}>
        <div className="timeline__track" aria-hidden="true">
          <motion.div
            className="timeline__fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.25 }}
          />
        </div>
        <ol className="timeline__steps" aria-label="Shipment progress">
          {JOURNEY.map((key, i) => {
            const done = i < current || (i === current && key === "delivered");
            const isCurrent = i === current && !done;
            return (
              <li key={key} className={`timeline__step ${done ? "is-done" : ""} ${isCurrent ? "is-current" : ""}`}
                  aria-current={isCurrent ? "step" : undefined}>
                <span className="timeline__dot">{done && <Check size={14} strokeWidth={3} />}</span>
                <span className="timeline__label">{STATUS[key].label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
