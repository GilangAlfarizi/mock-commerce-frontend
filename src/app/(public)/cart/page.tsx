export default function CartPage() {
	return (
		<div className="space-y-12">
			<section className="space-y-4 border border-black bg-cream p-5 text-cream-foreground md:p-6">
				<div className="flex">
					<div className="gap-4">
						<img
							src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
							alt="test"
						/>
					</div>
					<div className="p-4 bg-surface w-full border border-black space-y-2">
						<h1>Title Test</h1>
						<p className="inline-flex border border-black bg-cream px-2 py-0.5 text-xs">
							Category
						</p>
					</div>
				</div>
			</section>
			{/* <div className="mx-auto w-full px-4 py-8 sm:px-6">
				<h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Checkout flow is deferred until the order backend is ready.
				</p>
			</div> */}
		</div>
	);
}
