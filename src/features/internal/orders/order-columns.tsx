import { DataTableColumn } from "@/components/globals";
import { Badge } from "@/components/ui/badge";
import { formatIdr } from "@/lib/format-currency";
import { AdminOrderDTO } from "@/types/admin/order";

const createdFmt = new Intl.DateTimeFormat(undefined, {
	dateStyle: "medium",
	timeStyle: "short",
});

function statusBadgeVariant(
	status: string,
): "default" | "secondary" | "outline" | "destructive" {
	const s = status.toLowerCase();
	if (s === "cancelled") return "destructive";
	if (s === "delivered") return "default";
	if (s === "shipped" || s === "processing") return "secondary";
	return "outline";
}

export const orderColumns: DataTableColumn<AdminOrderDTO>[] = [
	{
		id: "orderNumber",
		header: "Order #",
		cell: (row) => (
			<span className="font-mono text-xs font-medium">{row.orderNumber}</span>
		),
	},
	{
		id: "customerName",
		header: "Customer",
		accessor: "customerName",
	},
	{
		id: "customerEmail",
		header: "Email",
		cell: (row) => (
			<span className="max-w-[200px] truncate text-muted-foreground">
				{row.customerEmail}
			</span>
		),
	},
	{
		id: "customerPhone",
		header: "Phone",
		accessor: "customerPhone",
	},
	{
		id: "paymentStatus",
		header: "Payment",
		cell: (row) => (
			<Badge variant="outline" className="capitalize">
				{row.paymentStatus}
			</Badge>
		),
	},
	{
		id: "status",
		header: "Status",
		cell: (row) => (
			<Badge variant={statusBadgeVariant(row.status)} className="capitalize">
				{row.status}
			</Badge>
		),
	},
	{
		id: "totalPrice",
		header: "Total",
		align: "right",
		cell: (row) => (
			<span className="tabular-nums font-medium">{formatIdr(row.totalPrice)}</span>
		),
	},
	{
		id: "createdAt",
		header: "Placed",
		cell: (row) => {
			if (!row.createdAt) return "—";
			const d = new Date(row.createdAt);
			if (Number.isNaN(d.getTime())) return row.createdAt;
			return createdFmt.format(d);
		},
	},
];
