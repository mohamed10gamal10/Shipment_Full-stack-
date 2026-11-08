import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { EmptyState } from "../components/ui/Feedback";

export default function NotFound() {
  return (
    <div className="container main">
      <EmptyState
        title="This page doesn't exist"
        text="The link may be wrong, or the page was moved."
        action={<Button as={Link} to="/">Go to the home page</Button>}
      />
    </div>
  );
}
