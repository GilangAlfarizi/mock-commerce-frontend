import type { DataTableColumn } from "@/components/globals/data-table";
import type { AdminCategoryDTO } from "@/types/admin/category";

const createdFmt = new Intl.DateTimeFormat(undefined, {
	dateStyle: "medium",
	timeStyle: "short",
});

export const categoryColumns: DataTableColumn<AdminCategoryDTO>[] = [
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
