/** Snap is safe to expose; choose script URL from key / env. */
export function resolveMidtransClientKey(): string {
	const pub = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.trim();
	if (pub) return pub;
	return process.env.NEXT_MIDTRANS_CLIENT_KEY?.trim() ?? "";
}

export function isMidtransSandboxKey(key: string): boolean {
	if (process.env.NEXT_PUBLIC_MIDTRANS_USE_SANDBOX === "true") return true;
	if (process.env.NEXT_PUBLIC_MIDTRANS_USE_SANDBOX === "false") return false;
	return key.startsWith("SB-");
}

export function midtransSnapScriptUrl(sandbox: boolean): string {
	return sandbox
		? "https://app.sandbox.midtrans.com/snap/snap.js"
		: "https://app.midtrans.com/snap/snap.js";
}
