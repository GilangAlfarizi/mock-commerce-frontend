import { Code2, Cpu, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";

const footerLinks = [
	{ label: "Home", href: "/home" },
	{ label: "Products", href: "/products" },
	{ label: "Contact", href: "#" },
];

const socialLinks = [
	{ label: "Dev Notes", href: "#", icon: Terminal },
	{ label: "Drop Alerts", href: "#", icon: Sparkles },
	{ label: "Engineering Journal", href: "#", icon: Code2 },
	{ label: "Build Updates", href: "#", icon: Cpu },
];

export default function PublicFooter() {
	return (
		<footer className="mt-16 border-t border-black bg-primary text-primary-foreground">
			<div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center gap-5 py-14 text-center sm:py-16">
					<h2 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
						Wear Your Stack
					</h2>
					<p className="max-w-2xl text-sm leading-7 text-primary-foreground/80 sm:text-base">
						Mock Commerce is a playground for developers who want outfits as relatable
						as their commit history. Clean design, nerdy copy, and enough comfort to
						survive stand-up, code review, and production hotfixes.
					</p>
					<div className="flex items-center justify-center gap-3">
						{socialLinks.map((social) => {
							const Icon = social.icon;

							return (
								<Link
									key={social.label}
									href={social.href}
									aria-label={social.label}
									className="flex size-10 items-center justify-center rounded-full border border-primary-foreground bg-cream text-surface-foreground transition-colors hover:bg-(--subtle-strong)">
									<Icon className="size-4" />
								</Link>
							);
						})}
					</div>
				</div>
			</div>
			<div className="border-t border-primary-foreground/30 bg-primary/90">
				<div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-primary-foreground/80 sm:flex-row sm:px-6 lg:px-8">
					<p>
						Copyright {new Date().getFullYear()}{" "}
						<span className="font-semibold text-primary-foreground">Mock Commerce</span>
					</p>
					<nav className="flex items-center gap-4">
						{footerLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className="transition-colors hover:text-primary-foreground">
								{link.label}
							</Link>
						))}
					</nav>
				</div>
			</div>
		</footer>
	);
}
