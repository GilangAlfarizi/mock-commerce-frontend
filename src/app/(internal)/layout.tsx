import { ReactNode } from "react";

export default function InternalLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<main>{children}</main>
		</>
	);
}
