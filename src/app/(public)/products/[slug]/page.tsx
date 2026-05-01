import { Button } from "@/components/ui/button";
import {
	getPublicProductResponseBySlug,
	type PublicProductDetail,
} from "@/features/public/products/mock-public-api";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductDetailPageProps = {
	params: Promise<{
		slug: string;
	}>;
};

function toCurrency(price: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	}).format(price);
}

function getFromPrice(product: PublicProductDetail) {
	const variantPrices = product.variants.map((variant) => product.price + variant.price);
	return Math.min(product.price, ...variantPrices);
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
	const { slug } = await params;
	const response = getPublicProductResponseBySlug(slug);

	if (!response) {
		notFound();
	}

	const product = response.data;
	const fromPrice = getFromPrice(product);

	return (
		<div className="space-y-6">
			<Link
				href="/products"
				className="inline-flex items-center gap-2 border border-black bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--cream)]">
				<ArrowLeft className="size-3.5" />
				Back to products
			</Link>

			<section className="grid gap-5 border border-black bg-[var(--cream)] p-5 md:grid-cols-[1.1fr_1fr] md:p-6">
				<div className="space-y-4">
					<div className="aspect-square border border-black bg-secondary" />
					<div className="grid grid-cols-3 gap-2">
						<div className="aspect-video border border-black bg-[var(--surface)]" />
						<div className="aspect-video border border-black bg-[var(--surface)]" />
						<div className="aspect-video border border-black bg-[var(--surface)]" />
					</div>
				</div>

				<div className="space-y-4">
					<p className="inline-flex border border-black bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
						{product.categoryName}
					</p>
					<h1 className="font-mono text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
						{product.name}
					</h1>
					<p className="text-sm leading-7 text-muted-foreground md:text-base">
						{product.description}
					</p>

					<div className="border border-black bg-[var(--surface)] p-4">
						<p className="text-xs text-muted-foreground">Starting from</p>
						<p className="font-mono text-2xl font-semibold">{toCurrency(fromPrice)}</p>
						<p className="mt-1 text-xs text-muted-foreground">
							Variant price deltas are applied per size and color.
						</p>
					</div>

					<div className="grid gap-2 text-sm sm:grid-cols-2">
						<div className="flex items-center gap-2 border border-black bg-[var(--surface)] px-3 py-2">
							<ShieldCheck className="size-4" />
							<span>Fabric QA passed</span>
						</div>
						<div className="flex items-center gap-2 border border-black bg-[var(--surface)] px-3 py-2">
							<Truck className="size-4" />
							<span>Dispatch in 1-2 workdays</span>
						</div>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button className="rounded-none border border-black">Add to cart (soon)</Button>
						<Button
							variant="outline"
							className="rounded-none border-black bg-[var(--surface)]"
							asChild>
							<Link href="/products">Continue browsing</Link>
						</Button>
					</div>
				</div>
			</section>

			<section className="space-y-3 border border-black bg-[var(--cream)] p-5 md:p-6">
				<div className="space-y-1">
					<h2 className="font-mono text-xl font-semibold tracking-tight">
						Available variants
					</h2>
					<p className="text-sm text-muted-foreground">
						Pick your build flavor: size, color, and stock visibility.
					</p>
				</div>
				<div className="overflow-x-auto border border-black bg-[var(--surface)]">
					<table className="w-full min-w-[560px] border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-black bg-secondary">
								<th className="px-3 py-2 font-mono">SKU</th>
								<th className="px-3 py-2 font-mono">Size</th>
								<th className="px-3 py-2 font-mono">Color</th>
								<th className="px-3 py-2 font-mono">Price</th>
								<th className="px-3 py-2 font-mono">Stock</th>
							</tr>
						</thead>
						<tbody>
							{product.variants.map((variant) => {
								const totalVariantPrice = product.price + variant.price;
								return (
									<tr key={variant.id} className="border-b border-black last:border-0">
										<td className="px-3 py-2 text-xs">{variant.sku}</td>
										<td className="px-3 py-2">{variant.size}</td>
										<td className="px-3 py-2">{variant.color}</td>
										<td className="px-3 py-2">{toCurrency(totalVariantPrice)}</td>
										<td className="px-3 py-2">{variant.stock}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
