import Image from "next/image";
import { ImageOff } from "lucide-react";

import { DataTableColumn } from "@/components/globals";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { formatIdr } from "@/lib/format-currency";
import { AdminProductDTO } from "@/types/admin/product";

export type ProductColumnsContext = {
	pendingPublishId: string | null;
	optimisticPublish: Record<string, boolean | undefined>;
	onPublishToggle: (row: AdminProductDTO, next: boolean) => void;
};

export function buildProductColumns(
	ctx: ProductColumnsContext,
): DataTableColumn<AdminProductDTO>[] {
	return [
		{
			id: "image",
			header: "Image",
			headerClassName: "w-[80px]",
			cell: (row) =>
				row.imageUrl ? (
					<Image
						src={row.imageUrl}
						alt={row.name}
						width={56}
						height={56}
						className="size-14 rounded-md border object-cover"
					/>
				) : (
					<div className="flex size-14 items-center justify-center rounded-md border bg-muted text-muted-foreground">
						<ImageOff className="size-4" aria-hidden />
					</div>
				),
		},
		{
			id: "name",
			header: "Name",
			cell: (row) => (
				<div className="min-w-0">
					<p className="truncate text-sm font-medium">{row.name}</p>
					<p className="truncate text-xs text-muted-foreground">{row.slug}</p>
				</div>
			),
		},
		{
			id: "category",
			header: "Category",
			cell: (row) => row.categoryName || "—",
		},
		{
			id: "type",
			header: "Type",
			cell: (row) =>
				row.hasVariant ? (
					<Badge variant="default" className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
						Variant
					</Badge>
				) : (
					<Badge variant="outline">Simple</Badge>
				),
		},
		{
			id: "price",
			header: "Price",
			align: "right",
			cell: (row) => (row.price ? formatIdr(row.price) : "—"),
		},
		{
			id: "totalStock",
			header: "Stock",
			align: "right",
			cell: (row) => (
				<span className="tabular-nums">{row.totalStock ?? 0}</span>
			),
		},
		{
			id: "publish",
			header: "Publish",
			align: "center",
			headerClassName: "w-[90px]",
			cell: (row) => {
				const optimistic = ctx.optimisticPublish[row.id];
				const checked =
					typeof optimistic === "boolean" ? optimistic : row.isActive;
				return (
					<div className="flex items-center justify-center">
						<Switch
							checked={checked}
							onCheckedChange={(next) => ctx.onPublishToggle(row, Boolean(next))}
							disabled={ctx.pendingPublishId === row.id}
							aria-label={
								checked ? `Unpublish ${row.name}` : `Publish ${row.name}`
							}
						/>
					</div>
				);
			},
		},
		{
			id: "status",
			header: "Status",
			cell: (row) => {
				const optimistic = ctx.optimisticPublish[row.id];
				const isActive =
					typeof optimistic === "boolean" ? optimistic : row.isActive;
				return isActive ? (
					<Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
						Published
					</Badge>
				) : (
					<Badge variant="outline" className="text-muted-foreground">
						Draft
					</Badge>
				);
			},
		},
	];
}
