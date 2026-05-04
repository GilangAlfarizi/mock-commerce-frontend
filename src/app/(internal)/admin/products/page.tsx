import { Package } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/globals";

export default function AdminProductsPage() {
	return (
		<div>
			<PageHeader title="Products" description="Create and manage catalog products (coming soon)." />
			<EmptyState
				icon={Package}
				title="Not implemented yet"
				description="Wire `GET/POST /admin/products` and shared DataTable in a follow-up pass."
			/>
		</div>
	);
}
