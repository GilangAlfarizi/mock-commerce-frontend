import type { DataTableColumn } from "./data-table";

const DATE_KEYS = new Set(["createdAt", "updatedAt"]);

const dateFmt = new Intl.DateTimeFormat(undefined, {
	dateStyle: "medium",
	timeStyle: "short",
});

function formatCell(key: string, value: unknown): string {
	if (value === null || value === undefined) return "—";
	if (DATE_KEYS.has(key) && typeof value === "string") {
		const d = new Date(value);
		if (!Number.isNaN(d.getTime())) return dateFmt.format(d);
	}
	if (typeof value === "object") return JSON.stringify(value);
	return String(value);
}

export type InferColumnsOptions<TData extends Record<string, unknown>> = {
	include?: (keyof TData)[];
	exclude?: (keyof TData)[];
	headers?: Partial<Record<keyof TData, string>>;
	order?: (keyof TData)[];
};

export function inferColumnsFromKeys<TData extends Record<string, unknown>>(
	sample: Partial<TData>,
	opts: InferColumnsOptions<TData> = {},
): DataTableColumn<TData>[] {
	const exclude = new Set(opts.exclude ?? []);
	const rawKeys = Object.keys(sample) as (keyof TData)[];
	let keys = rawKeys.filter((k) => !exclude.has(k));
	if (opts.include?.length) {
		const inc = new Set(opts.include);
		keys = keys.filter((k) => inc.has(k));
	}
	if (opts.order?.length) {
		const order = opts.order;
		keys = [...keys].sort((a, b) => {
			const ia = order.indexOf(a);
			const ib = order.indexOf(b);
			if (ia === -1 && ib === -1) return 0;
			if (ia === -1) return 1;
			if (ib === -1) return -1;
			return ia - ib;
		});
	}
	return keys.map((key) => {
		const id = String(key);
		const header = opts.headers?.[key] ?? id.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
		return {
			id,
			header,
			accessor: key,
			cell: (row) => formatCell(id, row[key]),
		};
	});
}
