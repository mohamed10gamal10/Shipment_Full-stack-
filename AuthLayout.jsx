import { Link } from "react-router-dom";
import { PackageCheck, Route, ShieldCheck } from "lucide-react";
import { BoxArt, Logo } from "./Illustrations";
import Page from "./Page";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth__side">
        <Link to="/" aria-label="Waybill home"><Logo light /></Link>
        <div className="auth__pitch">
          <BoxArt size={170} />
          <h2>Send it once. Follow it all the way.</h2>
          <ul>
            <li><PackageCheck size={20} /> Every item recorded with its value</li>
            <li><Route size={20} /> A clear status at each step</li>
            <li><ShieldCheck size={20} /> Only you can see your shipments</li>
          </ul>
        </div>
      </aside>

      <section className="auth__main">
        <Page className="auth__box">
          <div className="auth__mobile-logo"><Link to="/"><Logo /></Link></div>
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
          <p className="auth__footer">{footer}</p>
        </Page>
      </section>
    </div>
  );
}
