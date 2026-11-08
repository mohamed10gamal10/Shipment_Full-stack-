import Page from "../components/Page";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../lib/format";

const roleLabel = { customer: "Customer", admin: "Admin", delivery: "Delivery" };

function Row({ label, value }) {
  return <div><dt>{label}</dt><dd>{value || "—"}</dd></div>;
}

export default function Profile() {
  const { user, profile } = useAuth();
  return (
    <Page>
      <div className="page-head"><h1>Your account</h1></div>

      <section className="panel">
        <h2>Login</h2>
        <dl className="details">
          <Row label="Name" value={user.username} />
          <Row label="Email" value={user.email} />
          <Row label="Role" value={roleLabel[user.role] || user.role} />
        </dl>
      </section>

      {profile && (
        <section className="panel">
          <h2>Contact details</h2>
          <dl className="details">
            <Row label="Full name" value={profile.name} />
            <Row label="Phone" value={profile.phone} />
            <Row label="WhatsApp" value={profile.whatsapp_number} />
            <Row label="Gender" value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : ""} />
            <Row label="Birthday" value={profile.birthday ? formatDate(profile.birthday) : ""} />
            <Row label="Address" value={profile.address} />
            <Row label="City" value={profile.city} />
            <Row label="Country" value={profile.country} />
          </dl>
        </section>
      )}
    </Page>
  );
}
