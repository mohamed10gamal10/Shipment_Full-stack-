import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Copy, MapPin, Flag } from "lucide-react";
import Page from "../components/Page";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import StatusTimeline from "../components/StatusTimeline";
import { ErrorState, Skeleton } from "../components/ui/Feedback";
import { shipmentApi } from "../api/services";
import { useToast } from "../context/ToastContext";
import { ITEM_TYPES } from "../lib/constants";
import { formatDateTime, formatMoney, shipmentTotal, trackingId } from "../lib/format";

const typeLabel = (v) => ITEM_TYPES.find((t) => t.value === v)?.label || v;

export default function ShipmentDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setShipment(null);
    try {
      setShipment(await shipmentApi.get(id));
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(trackingId(shipment.id));
      toast.success("Tracking number copied.");
    } catch {
      toast.error("Couldn't copy. Select the number and copy it by hand.");
    }
  }

  return (
    <Page>
      <Link to="/dashboard" className="back"><ArrowLeft size={18} /> All shipments</Link>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !shipment ? (
        <div className="stack"><Skeleton height={90} /><Skeleton height={140} /><Skeleton height={200} /></div>
      ) : (
        <>
          <div className="page-head">
            <div>
              <h1>{shipment.name}</h1>
              <p className="muted">Tracking number <strong className="num">#{trackingId(shipment.id)}</strong></p>
            </div>
            <div className="page-head__side">
              <StatusBadge status={shipment.status} />
              <Button variant="ghost" size="sm" icon={Copy} onClick={copyId}>Copy number</Button>
            </div>
          </div>

          <section className="panel">
            <h2>Progress</h2>
            <StatusTimeline status={shipment.status} />
          </section>

          <section className="panel route">
            <div className="route__stop">
              <span className="route__icon"><MapPin size={20} /></span>
              <p className="route__label">Pickup from</p>
              <p className="route__city">{shipment.city_source}</p>
              <p className="muted">{shipment.address_source}</p>
            </div>
            <div className="route__line" aria-hidden="true" />
            <div className="route__stop">
              <span className="route__icon route__icon--end"><Flag size={20} /></span>
              <p className="route__label">Deliver to</p>
              <p className="route__city">{shipment.city_destination}</p>
              <p className="muted">{shipment.address_destination}, {shipment.state_destination}</p>
            </div>
          </section>

          {shipment.description && (
            <section className="panel">
              <h2>Notes</h2>
              <p>{shipment.description}</p>
            </section>
          )}

          <section className="panel">
            <h2>What's inside</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Item</th><th>Type</th><th className="r">Qty</th><th className="r">Price</th><th className="r">Subtotal</th></tr>
                </thead>
                <tbody>
                  {shipment.items.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <strong>{it.name}</strong>
                        {it.description && <div className="muted small">{it.description}</div>}
                      </td>
                      <td>{typeLabel(it.type)}</td>
                      <td className="r">{it.quantity}</td>
                      <td className="r">{formatMoney(it.price)}</td>
                      <td className="r">{formatMoney(Number(it.price) * it.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td colSpan={4}>Total value</td><td className="r">{formatMoney(shipmentTotal(shipment.items))}</td></tr>
                </tfoot>
              </table>
            </div>
          </section>

          <p className="muted small">Created {formatDateTime(shipment.created_at)} · Last updated {formatDateTime(shipment.updated_at)}</p>
        </>
      )}
    </Page>
  );
}
