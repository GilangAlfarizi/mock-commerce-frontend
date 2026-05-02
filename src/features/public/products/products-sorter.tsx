import { Button } from "@/components/ui/button";
import { ProductsSorterProps } from "@/types/product";

export function ProductsSorter({
	lengthData,
	totalData,
	categorySlugs,
	sortOptions,
	sort,
}: ProductsSorterProps) {
	return (
		<div className="flex flex-col gap-3 border border-black bg-cream p-4 md:flex-row md:items-center md:justify-between">
			<p className="text-sm text-muted-foreground">
				Showing{" "}
				<span className="font-semibold text-foreground">{lengthData}</span> of{" "}
				<span className="font-semibold text-foreground">{totalData}</span>{" "}
				products
			</p>
			<form method="get" className="flex flex-wrap items-center gap-2">
				{categorySlugs.map((slug) => (
					<input key={slug} type="hidden" name="categorySlugs" value={slug} />
				))}
				<input type="hidden" name="page" value="1" />
				<select
					name="sort"
					defaultValue={sort}
					className="h-8 min-w-44 rounded-none border border-black bg-surface px-2 text-xs">
					{sortOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<Button
					type="submit"
					variant="outline"
					className="rounded-none border-black bg-surface">
					Apply
				</Button>
			</form>
		</div>
	);
}
