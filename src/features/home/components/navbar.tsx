"use client";

import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomeNavbar() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 80);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className={clsx(
				"fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out",
				scrolled ? "top-0" : "top-6",
			)}>
			<div
				className={clsx(
					"flex items-center justify-center gap-8 px-10 py-4 transition-all duration-300 ease-in-out font-semibold",
					scrolled
						? "w-full max-w-none rounded-none bg-white shadow-lg"
						: "w-full rounded-full bg-white shadow-lg",
				)}>
				<div className="relative mt-6">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
					<Input
						placeholder="Search Product.."
						className="pl-9 bg-transparent focus-visible:ring-0"
					/>
				</div>
				<a
					href="#home"
					onClick={(e) => {
						e.preventDefault();
					}}
					className="hover:text-[#22333B] transition-colors duration-500">
					Home
				</a>
				<a
					href="#about"
					onClick={(e) => {
						e.preventDefault();
					}}
					className="hover:text-[#22333B] transition-colors duration-500">
					About us
				</a>
				<a
					href="#services"
					onClick={(e) => {
						e.preventDefault();
					}}
					className="hover:text-[#22333B] transition-colors duration-500">
					Services
				</a>
				<a
					href="#booking"
					onClick={(e) => {
						e.preventDefault();
					}}
					className="hover:text-[#22333B] transition-colors duration-500">
					Store
				</a>
				<a
					href="#contact"
					onClick={(e) => {
						e.preventDefault();
					}}
					className="hover:text-[#22333B] transition-colors duration-500">
					Contact us
				</a>
			</div>
		</div>
	);
}
