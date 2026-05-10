"use client";

import * as React from "react";

import { DataTable, type DataTableColumn } from "@/components/globals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrderDetail } from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatIdr } from "@/lib/format-currency";
import type { AdminOrderDetailDTO, AdminOrderItemDTO } from "@/types/admin/order";

const itemColumns: DataTableColumn<AdminOrderItemDTO>[] = [
	{ id: "productName", header: "Product", accessor: "productName" },
	{
		id: "variant",
		header: "Variant",
		cell: (row) =>
			[row.variantSize, row.variantColor].filter(Boolean).join(" · ") || "—",
	},
	{ id: "sku", header: "SKU", cell: (row) => row.variantSKU || "—" },
	{
		id: "qty",
		header: "Qty",
		align: "right",
		cell: (row) => <span className="tabular-nums">{row.quantity}</span>,
	},
	{
		id: "lineTotal",
		header: "Line total",
		align: "right",
		cell: (row) => (
			<span className="tabular-nums">{formatIdr(row.totalPrice)}</span>
		),
	},
];

function DetailTile({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="grid gap-1 rounded-xl border bg-card p-3">
			<p className="text-xs text-muted-foreground">{label}</p>
			<div className="break-words text-sm font-medium">{value ?? "—"}</div>
		</div>
	);
}

export type OrderReadDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	orderId: string | null;
};

function OrderReadDialog({ open, onOpenChange, orderId }: OrderReadDialogProps) {
	const { data, isPending, error, refetch } = useAdminOrderDetail(orderId, open);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Order detail</DialogTitle>
					<DialogDescription>
						Read-only snapshot from the server. Use Edit on the list to update
						fields.
					</DialogDescription>
				</DialogHeader>

				{isPending ? (
					<div className="grid gap-3 py-2">
						<Skeleton className="h-8 w-2/3" />
						<div className="grid gap-2 sm:grid-cols-2">
							{Array.from({ length: 6 }).map((_, i) => (
								<Skeleton key={i} className="h-16 w-full" />
							))}
						</div>
					</div>
				) : error ? (
					<p className="text-sm text-destructive" role="alert">
						{getApiErrorMessage(error)}
					</p>
				) : data ? (
					<OrderReadBody detail={data} />
				) : null}

				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Close
					</Button>
					{error && orderId ? (
						<Button type="button" variant="secondary" onClick={() => refetch()}>
							Retry
						</Button>
					) : null}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function OrderReadBody({ detail }: { detail: AdminOrderDetailDTO }) {
	const items = detail.items ?? [];

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center gap-2">
				<span className="font-mono text-lg font-semibold">{detail.orderNumber}</span>
				<Badge variant="outline" className="capitalize">
					{detail.paymentStatus}
				</Badge>
				<Badge variant="secondary" className="capitalize">
					{detail.status}
				</Badge>
			</div>

			<div className="grid gap-2 sm:grid-cols-2">
				<DetailTile label="Total" value={formatIdr(detail.totalPrice)} />
				<DetailTile label="Courier" value={detail.courier} />
				<DetailTile label="Tracking" value={detail.trackingNumber} />
				<DetailTile label="Shipped at" value={detail.shippedAt} />
				<DetailTile label="Delivered at" value={detail.deliveredAt} />
				<DetailTile label="Created" value={detail.createdAt} />
			</div>

			<div>
				<h3 className="mb-2 text-sm font-medium">Customer</h3>
				<div className="grid gap-2 sm:grid-cols-3">
					<DetailTile label="Name" value={detail.customerName} />
					<DetailTile label="Email" value={detail.customerEmail} />
					<DetailTile label="Phone" value={detail.customerPhone} />
				</div>
			</div>

			<div>
				<h3 className="mb-2 text-sm font-medium">Shipping</h3>
				<div className="grid gap-2 sm:grid-cols-3">
					<DetailTile label="Address" value={detail.shippingAddress} />
					<DetailTile label="City" value={detail.shippingCity} />
					<DetailTile label="Postal code" value={detail.shippingPostalCode} />
				</div>
			</div>

			<div>
				<h3 className="mb-2 text-sm font-medium">Line items</h3>
				<DataTable
					data={items}
					columns={itemColumns}
					getRowKey={(row) => row.id}
					emptyState={
						<p className="py-4 text-center text-sm text-muted-foreground">
							No line items on this order.
						</p>
					}
				/>
			</div>
		</div>
	);
}

export { OrderReadDialog };
