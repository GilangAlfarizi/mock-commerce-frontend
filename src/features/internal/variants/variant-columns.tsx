import type { DataTableColumn } from "@/components/globals";
import { formatIdr } from "@/lib/format-currency";
import type { AdminProductDTO } from "@/types/admin/product";
import type { AdminVariantDTO } from "@/types/admin/variant";

export type VariantColumnsContext = {
	product: AdminProductDTO | undefined;
};

export function buildVariantColumns(
	ctx: VariantColumnsContext,
): DataTableColumn<AdminVariantDTO>[] {
	return [
		{
			id: "sku",
			header: "SKU",
			cell: (row) => (
				<span className="font-mono text-xs">{row.sku || "—"}</span>
			),
		},
		{
			id: "size",
			header: "Size",
			cell: (row) => row.size || "—",
		},
		{
			id: "color",
			header: "Color",
			cell: (row) => row.color || "—",
		},
		{
			id: "stock",
			header: "Stock",
			align: "right",
			cell: (row) => <span className="tabular-nums">{row.stock}</span>,
		},
		{
			id: "price",
			header: "Variant price",
			align: "right",
			cell: (row) => (
				<span className="tabular-nums">
					{row.price > 0 ? formatIdr(row.price) : "—"}
				</span>
			),
		},
		{
			id: "effective",
			header: "Effective price",
			align: "right",
			cell: (row) => {
				const effective =
					row.price > 0 ? row.price : (ctx.product?.price ?? row.price);
				return (
					<span className="tabular-nums">
						{effective > 0 ? formatIdr(effective) : "—"}
					</span>
				);
			},
		},
	];
}
