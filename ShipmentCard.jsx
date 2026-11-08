import { Link } from "react-router-dom";
import { ChevronRight, Truck } from "lucide-react";
import StatusBadge from "./ui/StatusBadge";
import { formatDate, formatMoney, shipmentTotal, trackingId } from "../lib/format";

// A shipment shown like a paper waybill: main part + a perforated stub.
export default function ShipmentCard({ shipment }) {
  const items = shipment.items || [];
  return (
    <Link to={`/shipments/${shipment.id}`} className="waybill">
      <div className="waybill__main">
        <div className="waybill__top">
          <span className="waybill__id">#{trackingId(shipment.id)}</span>
          <StatusBadge status={shipment.status} />
        </div>
        <h3>{shipment.name}</h3>
        <div className="waybill__route">
          <span>{shipment.city_source}</span>
          <span className="waybill__line"><Truck size={16} /></span>
          <span>{shipment.city_destination}</span>
        </div>
      </div>
      <div className="waybill__stub">
        <dl>
          <div><dt>Created</dt><dd>{formatDate(shipment.created_at)}</dd></div>
          <div><dt>Items</dt><dd>{items.length}</dd></div>
          <div><dt>Value</dt><dd>{formatMoney(shipmentTotal(items))}</dd></div>
        </dl>
        <ChevronRight size={22} className="waybill__go" />
      </div>
    </Link>
  );
}
