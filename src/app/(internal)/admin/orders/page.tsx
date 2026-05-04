import { Receipt } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/globals";

export default function AdminOrdersPage() {
	return (
		<div>
			<PageHeader title="Orders" description="Order management is deferred until the backend exposes admin orders APIs." />
			<EmptyState
				icon={Receipt}
				title="Not implemented yet"
				description="See `docs/PROGRESS.md` — admin orders remain out of scope until APIs land."
			/>
		</div>
	);
}
