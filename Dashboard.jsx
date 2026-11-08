import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import Page from "../components/Page";
import Button from "../components/ui/Button";
import ShipmentCard from "../components/ShipmentCard";
import { EmptyState, ErrorState, Skeleton } from "../components/ui/Feedback";
import { fetchAllPages, shipmentApi } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { STATUS } from "../lib/constants";
import { trackingId } from "../lib/format";

const IN_PROGRESS = ["created", "pickup", "in_transit", "out_for_transit"];
const PAGE_SIZE = 6;

const list = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const row = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [shipments, setShipments] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const load = useCallback(async () => {
    setError("");
    setShipments(null);
    try {
      setShipments(await fetchAllPages(shipmentApi.list));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => {
    const all = shipments || [];
    return {
      total: all.length,
      active: all.filter((s) => IN_PROGRESS.includes(s.status)).length,
      delivered: all.filter((s) => s.status === "delivered").length,
      cancelled: all.filter((s) => s.status === "cancelled").length,
    };
  }, [shipments]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (shipments || []).filter((s) => {
      if (filter !== "all" && s.status !== filter) return false;
      if (!q) return true;
      return [s.name, s.city_source, s.city_destination, trackingId(s.id)].some((v) => v?.toLowerCase().includes(q));
    });
  }, [shipments, query, filter]);

  const firstName = (profile?.name || user.username || "").split(" ")[0];
  const isAdmin = user.role === "admin";
  const canCreate = user.role === "customer";

  return (
    <Page>
      <div className="page-head">
        <div>
          <h1>{isAdmin ? "All shipments" : `Hello, ${firstName}`}</h1>
          <p className="muted">{isAdmin ? "Every shipment from every customer." : "Here are your shipments."}</p>
        </div>
        {canCreate && <Button as={Link} to="/shipments/new" icon={Plus}>New shipment</Button>}
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <dl className="stats">
            <div><dd>{shipments ? stats.total : "–"}</dd><dt>Total</dt></div>
            <div><dd>{shipments ? stats.active : "–"}</dd><dt>On the way</dt></div>
            <div><dd>{shipments ? stats.delivered : "–"}</dd><dt>Delivered</dt></div>
            <div><dd>{shipments ? stats.cancelled : "–"}</dd><dt>Cancelled</dt></div>
          </dl>

          <div className="toolbar">
            <label className="search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search by name, city or tracking number"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
                aria-label="Search shipments"
              />
            </label>
            <div className="chips" role="group" aria-label="Filter by status">
              {["all", ...Object.keys(STATUS)].map((key) => (
                <button
                  key={key}
                  className={`chip ${filter === key ? "is-on" : ""}`}
                  aria-pressed={filter === key}
                  onClick={() => { setFilter(key); setVisible(PAGE_SIZE); }}
                >
                  {key === "all" ? "All" : STATUS[key].label}
                </button>
              ))}
            </div>
          </div>

          {!shipments ? (
            <div className="stack"><Skeleton height={112} count={3} /></div>
          ) : shipments.length === 0 ? (
            <EmptyState
              title="No shipments yet"
              text={canCreate ? "Create your first shipment and it will show up here." : "Shipments will show up here once customers create them."}
              action={canCreate && <Button as={Link} to="/shipments/new" icon={Plus}>Create a shipment</Button>}
            />
          ) : shown.length === 0 ? (
            <EmptyState title="Nothing matches" text="Try a different search or choose another status." />
          ) : (
            <>
              <motion.ul key={filter} className="stack" variants={list} initial="hidden" animate="show">
                {shown.slice(0, visible).map((s) => (
                  <motion.li key={s.id} variants={row}><ShipmentCard shipment={s} /></motion.li>
                ))}
              </motion.ul>
              {visible < shown.length && (
                <div className="center-block">
                  <Button variant="ghost" onClick={() => setVisible(visible + PAGE_SIZE)}>
                    Show more ({shown.length - visible} left)
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </Page>
  );
}
