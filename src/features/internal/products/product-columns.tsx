import { DataTableColumn } from "@/components/globals";
import { AdminProductDTO } from "@/types/admin/product";

const createdFmt = new Intl.DateTimeFormat(undefined, {
	dateStyle: "medium",
	timeStyle: "short",
});

const priceFmt = (amount: number) =>
	new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(amount);

export const productColumns: DataTableColumn<AdminProductDTO>[] = [
	{
		id: "name",
		header: "Name",
		accessor: "name",
	},
	{
		id: "slug",
		header: "Slug",
		accessor: "slug",
	},
	{
		id: "price",
		header: "Price",
		cell: (row) => {
			if (!row.price) return "-";
			return priceFmt(row.price);
		},
	},
	{
		id: "imageUrl",
		header: "Image",
		cell: (row) => {
			if (!row.imageUrl) return "-";

			return (
				<img
					src={row.imageUrl}
					alt={row.name}
					className="size-16 rounded-md border"
				/>
			);
		},
	},
	{
		id: "categoryId",
		header: "Category",
		accessor: "categoryName",
	},
	{
		id: "isActive",
		header: "On Display",
		accessor: "isActive",
	},
	{
		id: "createdAt",
		header: "Created",
		cell: (row) => {
			if (!row.createdAt) return "—";
			const d = new Date(row.createdAt);
			if (Number.isNaN(d.getTime())) return row.createdAt;
			return createdFmt.format(d);
		},
	},
];
