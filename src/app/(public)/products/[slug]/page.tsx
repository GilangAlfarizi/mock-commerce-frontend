import ProductAddToCart from "@/features/public/components/product-add-to-cart";
import { getProductBySlug } from "@/services/products";
import type { PublicProductDetail } from "@/types/product";
import { isAxiosError } from "axios";
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
	const variantPrices = product.variants.map(
		(variant) => product.price + variant.price,
	);
	return Math.min(product.price, ...variantPrices);
}

export default async function ProductDetailPage({
	params,
}: ProductDetailPageProps) {
	const { slug } = await params;

	let response;
	try {
		response = await getProductBySlug(slug);
	} catch (error) {
		if (isAxiosError(error) && error.response?.status === 404) {
			notFound();
		}
		throw error;
	}

	const product = response.data;
	const fromPrice = getFromPrice(product);

	return (
		<div className="space-y-6">
			<Link
				href="/products"
				className="inline-flex items-center gap-2 border border-black bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-cream">
				<ArrowLeft className="size-3.5" />
				Back to products
			</Link>

			<section className="grid gap-5 border border-black bg-cream p-5 md:grid-cols-[1.1fr_1fr] md:p-6">
				<div className="space-y-4">
					<img
						src={product.imageUrl}
						alt={product.imageUrl}
						className="aspect-square border border-black"
					/>
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

					<div className="border border-black bg-surface p-4">
						<p className="text-xs text-muted-foreground">Starting from</p>
						<p className="font-mono text-2xl font-semibold">
							{toCurrency(fromPrice)}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							Variant price deltas are applied per size and color.
						</p>
					</div>

					<div className="grid gap-2 text-sm sm:grid-cols-2">
						<div className="flex items-center gap-2 border border-black bg-surface px-3 py-2">
							<ShieldCheck className="size-4" />
							<span>Fabric QA passed</span>
						</div>
						<div className="flex items-center gap-2 border border-black bg-surface px-3 py-2">
							<Truck className="size-4" />
							<span>Dispatch in 1-2 workdays</span>
						</div>
					</div>

					<ProductAddToCart product={product} />
				</div>
			</section>

			<section className="space-y-3 border border-black bg-cream p-5 md:p-6">
				<div className="space-y-1">
					<h2 className="font-mono text-xl font-semibold tracking-tight">
						Available variants
					</h2>
					<p className="text-sm text-muted-foreground">
						Pick your build flavor: size, color, and stock visibility.
					</p>
				</div>
				<div className="overflow-x-auto border border-black bg-surface">
					<table className="w-full min-w-140 border-collapse text-left text-sm">
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
									<tr
										key={variant.id}
										className="border-b border-black last:border-0">
										<td className="px-3 py-2 text-xs">{variant.sku}</td>
										<td className="px-3 py-2">{variant.size}</td>
										<td className="px-3 py-2">{variant.color}</td>
										<td className="px-3 py-2">
											{toCurrency(totalVariantPrice)}
										</td>
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
