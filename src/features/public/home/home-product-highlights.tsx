import Link from "next/link";

const highlightProducts = [
	{
		name: "Null Pointer Tee",
		tagline: "Soft cotton. Hard truth.",
		price: "IDR 189.000",
	},
	{
		name: "Works On My Machine Hoodie",
		tagline: "The most honest deployment strategy.",
		price: "IDR 389.000",
	},
	{
		name: "Git Blame Varsity Jacket",
		tagline: "Stylish enough to survive code review.",
		price: "IDR 649.000",
	},
	{
		name: "No Bugs, Just Features Cap",
		tagline: "One-size-fits-most sprint survivors.",
		price: "IDR 149.000",
	},
];

export default function HomeProductHighlight() {
	return (
		<section className="space-y-4 border border-black bg-[var(--cream)] p-5 text-[var(--cream-foreground)] md:p-6">
			<div className="flex items-end justify-between gap-4">
				<h2 className="font-mono text-2xl font-semibold tracking-tight">
					Highlighted products
				</h2>
				<Link
					href="/products"
					className="text-sm font-medium underline decoration-black underline-offset-4">
					See all products
				</Link>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{highlightProducts.map((product) => (
					<article
						key={product.name}
						className="border border-black bg-[var(--surface)] p-3">
						<div className="aspect-[4/5] border border-black bg-secondary" />
						<div className="mt-3 space-y-1">
							<h3 className="font-mono text-sm font-semibold">
								{product.name}
							</h3>
							<p className="text-xs text-muted-foreground">{product.tagline}</p>
							<p className="text-sm font-semibold">{product.price}</p>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
