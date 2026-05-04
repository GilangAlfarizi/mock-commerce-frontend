"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api-error";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useLoginMutation } from "@/hooks/use-login-mutation";

function LoginForm() {
	const router = useRouter();
	const { status } = useAuthSession();
	const loginMutation = useLoginMutation();

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const didRedirectRef = React.useRef(false);

	React.useEffect(() => {
		if (status === "unauthenticated") {
			didRedirectRef.current = false;
		}
	}, [status]);

	React.useEffect(() => {
		if (status !== "authenticated" || didRedirectRef.current) return;
		didRedirectRef.current = true;
		router.replace("/admin/categories");
	}, [status, router]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loginMutation.mutate({ email: email.trim(), password });
	};

	const disabled = loginMutation.isPending || status === "loading" || status === "authenticated";

	return (
		<form
			onSubmit={handleSubmit}
			className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-background p-6 shadow-sm">
			<div className="space-y-1 text-center">
				<h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
				<p className="text-sm text-muted-foreground">Internal admin — use your staff credentials.</p>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={disabled}
					required
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					name="password"
					type="password"
					autoComplete="current-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={disabled}
					required
				/>
			</div>
			{loginMutation.error ? (
				<p className="text-center text-sm text-destructive" role="alert">
					{getApiErrorMessage(loginMutation.error)}
				</p>
			) : null}
			<Button type="submit" className="w-full" disabled={disabled}>
				{loginMutation.isPending ? "Signing in…" : "Sign in"}
			</Button>
		</form>
	);
}

export { LoginForm };
