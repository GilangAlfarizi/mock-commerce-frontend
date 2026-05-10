import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { isAxiosError } from "axios";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { getPublicOrderByNumber } from "@/services/public/order.service";
import { formatIdr } from "@/lib/format-currency";
import type { AdminOrderDetailDTO } from "@/types/admin/order";

type OrderTrackPageProps = {
	params: Promise<{ orderNumber: string }>;
};

function DetailBlock({
	label,
	value,
}: {
	label: string;
	value: ReactNode;
}) {
	return (
		<div className="border border-black bg-surface px-3 py-2">
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="font-mono text-sm font-medium">{value ?? "—"}</p>
		</div>
	);
}

function OrderTrackSections({ order }: { order: AdminOrderDetailDTO }) {
	const items = order.items ?? [];

	return (
		<div className="space-y-6">
			<section className="border border-black bg-cream p-5 md:p-6">
				<div className="flex flex-wrap items-center gap-2">
					<h1 className="font-mono text-2xl font-semibold tracking-tight md:text-3xl">
						{order.orderNumber}
					</h1>
					<Badge variant="outline" className="capitalize">
						{order.paymentStatus}
					</Badge>
					<Badge variant="secondary" className="capitalize">
						{order.status}
					</Badge>
				</div>
				<p className="mt-2 text-sm text-muted-foreground">
					Track shipment and payment status for this order.
				</p>
				<div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					<DetailBlock label="Total" value={formatIdr(order.totalPrice)} />
					<DetailBlock label="Courier" value={order.courier} />
					<DetailBlock label="Tracking" value={order.trackingNumber} />
					<DetailBlock label="Shipped" value={order.shippedAt} />
					<DetailBlock label="Delivered" value={order.deliveredAt} />
					<DetailBlock label="Placed" value={order.createdAt} />
				</div>
			</section>

			<section className="border border-black bg-cream p-5 md:p-6">
				<h2 className="font-mono text-lg font-semibold">Shipping to</h2>
				<div className="mt-3 grid gap-2 sm:grid-cols-3">
					<DetailBlock label="Address" value={order.shippingAddress} />
					<DetailBlock label="City" value={order.shippingCity} />
					<DetailBlock label="Postal code" value={order.shippingPostalCode} />
				</div>
			</section>

			<section className="space-y-3 border border-black bg-cream p-5 md:p-6">
				<h2 className="font-mono text-lg font-semibold">Items</h2>
				<div className="overflow-x-auto border border-black bg-surface">
					<table className="w-full min-w-80 border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-black bg-secondary">
								<th className="px-3 py-2 font-mono">Product</th>
								<th className="px-3 py-2 font-mono">Variant</th>
								<th className="px-3 py-2 font-mono">Qty</th>
								<th className="px-3 py-2 font-mono">Line total</th>
							</tr>
						</thead>
						<tbody>
							{items.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="px-3 py-6 text-center text-muted-foreground">
										No line items returned for this order.
									</td>
								</tr>
							) : (
								items.map((line) => (
									<tr
										key={line.id}
										className="border-b border-black last:border-0">
										<td className="px-3 py-2">{line.productName}</td>
										<td className="px-3 py-2 text-xs">
											{[line.variantSize, line.variantColor]
												.filter(Boolean)
												.join(" · ") || "—"}
										</td>
										<td className="px-3 py-2 tabular-nums">{line.quantity}</td>
										<td className="px-3 py-2 tabular-nums">
											{formatIdr(line.totalPrice)}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}

export default async function OrderTrackPage({ params }: OrderTrackPageProps) {
	const { orderNumber } = await params;
	const decoded = decodeURIComponent(orderNumber);

	let order: AdminOrderDetailDTO;
	try {
		order = await getPublicOrderByNumber(decoded);
	} catch (error) {
		if (isAxiosError(error) && error.response?.status === 404) {
			notFound();
		}
		throw error;
	}

	return (
		<div className="space-y-6">
			<Link
				href="/products"
				className="inline-flex items-center gap-2 border border-black bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-cream">
				<ArrowLeft className="size-3.5" />
				Back to shop
			</Link>

			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Package className="size-4" />
				<span>Order tracking (link from your email)</span>
			</div>

			<OrderTrackSections order={order} />
		</div>
	);
}
