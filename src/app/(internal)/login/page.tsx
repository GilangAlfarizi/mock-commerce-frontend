import { LoginForm } from "@/features/internal/login/login-form";

export default function LoginPage() {
	return (
		<div className="flex min-h-[calc(100vh-0px)] flex-col items-center justify-center bg-muted/30 px-4 py-12">
			<LoginForm />
		</div>
	);
}
