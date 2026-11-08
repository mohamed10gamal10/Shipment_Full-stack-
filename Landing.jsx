import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, ListChecks, MapPinned, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { HeroRoute, Logo } from "../components/Illustrations";

const steps = [
  { icon: UserPlus, title: "Create your account", text: "Sign up with your email and add your contact details once." },
  { icon: ClipboardList, title: "Describe your parcel", text: "Set the pickup and drop-off, then list what's inside." },
  { icon: MapPinned, title: "Follow it to the door", text: "Open any shipment to see exactly where it is." },
];

const perks = [
  { icon: ListChecks, title: "Every item on record", text: "Name, type, quantity and price for each item in the parcel." },
  { icon: MapPinned, title: "A clear status at every step", text: "From created to delivered, shown as a simple timeline." },
  { icon: ShieldCheck, title: "Private by default", text: "You see your shipments. Nobody else does, except admins." },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      <header className="landing__bar">
        <div className="container landing__bar-inner">
          <Link to="/" aria-label="Waybill home"><Logo /></Link>
          <div className="landing__actions">
            {user ? (
              <Button as={Link} to="/dashboard" variant="dark" size="sm">Open dashboard</Button>
            ) : (
              <>
                <Button as={Link} to="/login" variant="ghost" size="sm">Log in</Button>
                <Button as={Link} to="/register" size="sm">Create account</Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="container hero">
        <div className="hero__text">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Door to door, without the guesswork.
          </motion.h1>
          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
          >
            Create a shipment in about a minute, list what's inside, and follow it from pickup to delivery.
          </motion.p>
          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
          >
            <Button as={Link} to={user ? "/shipments/new" : "/register"} iconRight={ArrowRight}>
              {user ? "Create a shipment" : "Create free account"}
            </Button>
            {!user && <Button as={Link} to="/login" variant="ghost">Log in</Button>}
          </motion.div>
        </div>
        <div className="hero__art"><HeroRoute /></div>
      </section>

      <section className="container section">
        <h2 className="section__title">How it works</h2>
        <ol className="steps">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="steps__item">
              <span className="steps__num">{i + 1}</span>
              <Icon size={28} />
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section">
        <h2 className="section__title">Made to keep things simple</h2>
        <ul className="perks">
          {perks.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="perks__icon"><Icon size={24} /></span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="container">
        <div className="cta-band">
          <h2>Ready to send your first parcel?</h2>
          <Button as={Link} to={user ? "/shipments/new" : "/register"} iconRight={ArrowRight}>
            {user ? "Create a shipment" : "Create free account"}
          </Button>
        </div>
      </section>

      <footer className="container landing__footer">
        <Logo />
        <span className="muted">Built with Django and React</span>
      </footer>
    </div>
  );
}
