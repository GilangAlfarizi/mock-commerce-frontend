"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomeJumbotron() {
	return (
		<section className="grid gap-6 border border-black bg-cream p-6 text-cream-foreground md:grid-cols-2 md:p-8">
			<div className="space-y-5">
				<p className="inline-flex items-center gap-2 border border-black bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
					<Sparkles className="size-3.5" />
					New drop: Commit & Chill Collection
				</p>
				<h1 className="font-mono text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
					Wear your stack.
					<br />
					Debug in style.
				</h1>
				<p className="max-w-prose text-sm text-muted-foreground md:text-base">
					Apparel for developers who treat coffee like dependency injection.
					From clean minimal prints to witty error-message designs, this line is
					built for people who live in tabs and terminals.
				</p>
				<div className="flex flex-wrap gap-3">
					<motion.div
						whileHover={{ scale: 1.1, y: -2 }}
						whileTap={{ scale: 0.9 }}>
						<Button className="rounded-none border border-black" asChild>
							<Link href="/products">
								Start shopping
								<ArrowRight className="size-4" />
							</Link>
						</Button>
					</motion.div>
					<motion.div
						whileHover={{ scale: 1.1, y: -2 }}
						whileTap={{ scale: 0.9 }}>
						<Button
							variant="outline"
							className="rounded-none border-black bg-surface hover:bg-accent"
							asChild>
							<Link href="/products">Browse highlights</Link>
						</Button>
					</motion.div>
				</div>
			</div>

			<motion.div
				animate={{ y: [0, -6, 0] }}
				transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
				className="border border-black bg-accent p-4">
				<div className="border border-black bg-surface p-4">
					<p className="font-mono text-xs text-muted-foreground">
						$ npm run outfit -- --mode confident
					</p>
					<div className="mt-4 space-y-3 text-sm">
						<div className="flex items-center justify-between border border-black bg-secondary px-3 py-2">
							<span>Comfort</span>
							<span className="font-mono">99%</span>
						</div>
						<div className="flex items-center justify-between border border-black bg-secondary px-3 py-2">
							<span>Relatability</span>
							<span className="font-mono">A+</span>
						</div>
						<div className="flex items-center justify-between border border-black bg-secondary px-3 py-2">
							<span>Deploy speed</span>
							<span className="font-mono">instant</span>
						</div>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
