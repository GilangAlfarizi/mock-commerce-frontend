import HomeNavbar from "@/features/home/components/navbar";
import React from "react";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<HomeNavbar />
			{children}
		</div>
	);
}
