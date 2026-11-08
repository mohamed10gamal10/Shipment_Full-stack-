import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Page from "../components/Page";
import Button from "../components/ui/Button";
import { EmptyState, ErrorState, Skeleton } from "../components/ui/Feedback";
import { customerApi } from "../api/services";
import { formatDate } from "../lib/format";

// Admin only: the backend sends customers 10 at a time, so we page through them.
export default function Customers() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setData(null);
    try {
      setData(await customerApi.list(page));
    } catch (err) {
      setError(err.message);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const pages = data ? Math.max(1, Math.ceil(data.count / 10)) : 1;

  return (
    <Page>
      <div className="page-head">
        <div>
          <h1>Customers</h1>
          <p className="muted">{data ? `${data.count} registered` : "Loading…"}</p>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !data ? (
        <div className="stack"><Skeleton height={56} count={5} /></div>
      ) : data.results.length === 0 ? (
        <EmptyState title="No customers yet" text="Customers appear here after they add their contact details." />
      ) : (
        <>
          <div className="panel table-wrap">
            <table className="table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Joined</th></tr></thead>
              <tbody>
                {data.results.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.city}</td>
                    <td>{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pager">
            <Button variant="ghost" size="sm" icon={ChevronLeft} disabled={!data.previous} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className="muted">Page {page} of {pages}</span>
            <Button variant="ghost" size="sm" iconRight={ChevronRight} disabled={!data.next} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </>
      )}
    </Page>
  );
}
