import { Button } from "@/components/ui/button";
import type { PublicCategoryDTO } from "@/types/category";
import Link from "next/link";

export function CategorySidebar({
	sort,
	categorySlugs,
	categories,
}: {
	sort: string;
	categorySlugs: string[];
	categories: PublicCategoryDTO[];
}) {
	return (
		<aside className="h-fit space-y-4 border border-black bg-cream p-4">
			<div>
				<h2 className="font-mono text-lg font-semibold">Filters</h2>
				<p className="text-xs text-muted-foreground">
					Select multiple categories (OR logic).
				</p>
			</div>
			<form method="get" className="space-y-4">
				<input type="hidden" name="sort" value={sort} />
				<input type="hidden" name="page" value="1" />
				<div className="space-y-2">
					{categories.map((category) => (
						<label
							key={category.id}
							className="flex items-center gap-2 border border-black bg-surface px-2 py-1.5 text-sm">
							<input
								type="checkbox"
								name="categorySlugs"
								value={category.slug}
								defaultChecked={categorySlugs.includes(category.slug)}
							/>
							<span>{category.name}</span>
						</label>
					))}
				</div>
				<Button
					type="submit"
					className="w-full rounded-none border border-black">
					Apply
				</Button>
				<Button
					type="button"
					variant="outline"
					className="w-full rounded-none border-black bg-surface"
					asChild>
					<Link href="/products">Reset</Link>
				</Button>
			</form>
		</aside>
	);
}
