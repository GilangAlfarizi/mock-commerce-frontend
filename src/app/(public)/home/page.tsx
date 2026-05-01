import HomeBrandValue from "@/features/public/home/home-brand-value";
import HomeJumbotron from "@/features/public/home/home-jumbotron";
import HomeProductHighlights from "@/features/public/home/home-product-highlights";

export default function HomePage() {
	return (
		<div className="space-y-12">
			<HomeJumbotron />
			<HomeBrandValue />
			<HomeProductHighlights />
		</div>
	);
}
