import HomeNavbar from "@/features/public/components/navbar";
import PublicFooter from "@/features/public/components/footer";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<HomeNavbar />
			<main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
				{children}
			</main>
			<PublicFooter />
		</>
	);
}
