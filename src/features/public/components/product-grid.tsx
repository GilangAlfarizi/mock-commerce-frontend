import { ProductCardProps } from "@/types/product";
import ProductCard from "./product-card";

type ProductGridProps = {
	products: ProductCardProps[];
};

export default function ProductGrid({ products }: ProductGridProps) {
	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{products.map((product) => (
				<ProductCard key={product.id} {...product} />
			))}
		</div>
	);
}
