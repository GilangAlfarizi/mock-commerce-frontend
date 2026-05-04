import { Shapes } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/globals";

export default function AdminVariantsPage() {
	return (
		<div>
			<PageHeader title="Variants" description="Manage product variants per product (coming soon)." />
			<EmptyState
				icon={Shapes}
				title="Not implemented yet"
				description="Use admin variant endpoints under `/admin/products/{id}/variants` when you implement this screen."
			/>
		</div>
	);
}
