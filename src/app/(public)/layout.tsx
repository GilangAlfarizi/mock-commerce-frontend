import HomeNavbar from "@/features/home/components/navbar";
import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<HomeNavbar />
			{children}
		</>
	);
}
