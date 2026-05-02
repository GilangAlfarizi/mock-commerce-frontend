export function ProductHero() {
	return (
		<section className="border border-black bg-cream p-5 md:p-6">
			<div className="space-y-2">
				<p className="inline-flex border border-black bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
					Catalog mode: ON
				</p>
				<h1 className="font-mono text-3xl font-semibold tracking-tight md:text-4xl">
					Ship your outfit like you ship your sprint
				</h1>
				<p className="max-w-3xl text-sm text-muted-foreground md:text-base">
					Filter by category, sort by budget, and pick your next deploy-day fit.
					All products below are using mock data shaped to the public API
					contract.
				</p>
			</div>
		</section>
	);
}
