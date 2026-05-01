const productTraits = [
  {
    title: "Runtime Comfort",
    description:
      "Breathable daily fabrics for long sessions of coding, coffee, and random prod incidents.",
  },
  {
    title: "Readable Design",
    description:
      "Minimal silhouettes with playful developer references that pass visual linting.",
  },
  {
    title: "Ship-ready Quality",
    description:
      "Durable prints and stitching tested through commute, meetup nights, and weekend debugging.",
  },
];

export default function HomeBrandValue() {
	return (
		<section className="space-y-4 border border-black bg-[var(--cream)] p-5 text-[var(--cream-foreground)] md:p-6">
			<div className="flex items-end justify-between gap-4">
				<div>
					<h2 className="font-mono text-2xl font-semibold tracking-tight">
						Built for your daily sprint
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						Everything you need to look sharp from stand-up to stand-down.
					</p>
				</div>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
				{productTraits.map((trait) => (
					<article
						key={trait.title}
						className="border border-black bg-[var(--surface)] p-4 md:p-5">
						<h3 className="font-mono text-lg font-semibold">{trait.title}</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							{trait.description}
						</p>
					</article>
				))}
			</div>
		</section>
	);
}
