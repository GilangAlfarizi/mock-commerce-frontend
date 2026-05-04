"use client";

import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/api-error";

export type DataTableColumn<TData> = {
	id: string;
	header: React.ReactNode;
	accessor?: keyof TData | ((row: TData) => React.ReactNode);
	cell?: (row: TData, ctx: { rowIndex: number }) => React.ReactNode;
	align?: "left" | "right" | "center";
	headerClassName?: string;
	cellClassName?: string;
};

export type DataTableProps<TData> = {
	data: TData[] | undefined;
	columns: DataTableColumn<TData>[];
	getRowKey: (row: TData, index: number) => string;
	isLoading?: boolean;
	error?: unknown;
	emptyState?: React.ReactNode;
	rowActions?: (row: TData) => React.ReactNode;
	caption?: React.ReactNode;
};

function resolveCell<TData>(
	col: DataTableColumn<TData>,
	row: TData,
	rowIndex: number,
): React.ReactNode {
	if (col.cell) return col.cell(row, { rowIndex });
	if (col.accessor === undefined) return null;
	if (typeof col.accessor === "function") return col.accessor(row);
	const v = row[col.accessor];
	if (v === null || v === undefined) return "—";
	if (typeof v === "object") return JSON.stringify(v);
	return String(v);
}

function DataTable<TData>({
	data,
	columns,
	getRowKey,
	isLoading,
	error,
	emptyState,
	rowActions,
	caption,
}: DataTableProps<TData>) {
	const hasActions = Boolean(rowActions);
	const allColumns = React.useMemo(() => {
		if (!hasActions) return columns;
		return [
			...columns,
			{
				id: "__actions",
				header: <span className="sr-only">Actions</span>,
				align: "right" as const,
				headerClassName: "w-[1%] whitespace-nowrap",
				cellClassName: "text-right",
			},
		];
	}, [columns, hasActions]);

	const alignClass = (a?: "left" | "right" | "center") =>
		a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

	if (error) {
		return (
			<div
				role="alert"
				className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
				{getApiErrorMessage(error)}
			</div>
		);
	}

	return (
		<div className="relative w-full overflow-x-auto rounded-2xl border border-border">
			<table className="w-full min-w-[32rem] caption-bottom text-sm">
				{caption ? <caption className="mt-2 text-muted-foreground">{caption}</caption> : null}
				<thead>
					<tr className="border-b border-border bg-muted/40">
						{allColumns.map((col) => (
							<th
								key={col.id}
								scope="col"
								className={cn(
									"h-10 px-3 text-left align-middle font-medium text-muted-foreground first:pl-4 last:pr-4",
									alignClass(col.align),
									col.headerClassName,
								)}>
								{col.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						Array.from({ length: 5 }).map((_, i) => (
							<tr key={`sk-${i}`} className="border-b border-border/80 last:border-0">
								{allColumns.map((col) => (
									<td key={col.id} className="px-3 py-2.5 first:pl-4 last:pr-4">
										<Skeleton className="h-6 w-full" />
									</td>
								))}
							</tr>
						))
					) : !data?.length ? (
						<tr>
							<td colSpan={allColumns.length} className="p-6">
								{emptyState ?? (
									<p className="text-center text-sm text-muted-foreground">No rows.</p>
								)}
							</td>
						</tr>
					) : (
						data.map((row, rowIndex) => (
							<tr
								key={getRowKey(row, rowIndex)}
								className={cn(
									"border-b border-border/80 transition-colors last:border-0",
									rowIndex % 2 === 1 ? "bg-muted/20" : "bg-background",
								)}>
								{columns.map((col) => (
									<td
										key={col.id}
										className={cn(
											"px-3 py-2.5 align-middle first:pl-4 last:pr-4",
											alignClass(col.align),
											col.cellClassName,
										)}>
										{resolveCell(col, row, rowIndex)}
									</td>
								))}
								{hasActions ? (
									<td className="px-3 py-2.5 pr-4 text-right align-middle whitespace-nowrap">
										{rowActions?.(row)}
									</td>
								) : null}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

export { DataTable };
