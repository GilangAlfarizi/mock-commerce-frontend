"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearCart } from "@/lib/cart/actions";
import type { EnrichedCartLine } from "@/types/cart";
import { formatIdr } from "@/lib/format-currency";
import {
	isMidtransSandboxKey,
	midtransSnapScriptUrl,
	resolveMidtransClientKey,
} from "@/lib/midtrans/client";
import { postCheckout } from "@/services/checkout/checkout.service";
import type { PublicOrderInput } from "@/types/checkout";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState, useTransition } from "react";

type CartCheckoutClientProps = {
	validLines: EnrichedCartLine[];
	subtotal: number;
};

const SNAP_ATTR = "data-midtrans-snap";

function loadSnapScript(clientKey: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (typeof document === "undefined") return;
		const existing = document.querySelector(`script[${SNAP_ATTR}]`);
		if (existing) {
			if (window.snap?.pay) resolve();
			else existing.addEventListener("load", () => resolve());
			return;
		}
		const sandbox = isMidtransSandboxKey(clientKey);
		const script = document.createElement("script");
		script.type = "text/javascript";
		script.src = midtransSnapScriptUrl(sandbox);
		script.setAttribute("data-client-key", clientKey);
		script.setAttribute(SNAP_ATTR, "1");
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Failed to load Midtrans Snap"));
		document.body.appendChild(script);
	});
}

export default function CartCheckoutClient({
	validLines,
	subtotal,
}: CartCheckoutClientProps) {
	const router = useRouter();
	const baseId = useId();
	const [pending, startTransition] = useTransition();

	const [customerName, setCustomerName] = useState("");
	const [customerEmail, setCustomerEmail] = useState("");
	const [customerPhone, setCustomerPhone] = useState("");
	const [shippingAddress, setShippingAddress] = useState("");
	const [shippingCity, setShippingCity] = useState("");
	const [shippingPostalCode, setShippingPostalCode] = useState("");
	const [formError, setFormError] = useState<string | null>(null);

	const clientKey = resolveMidtransClientKey();

	const ensureSnap = useCallback(async () => {
		if (!clientKey) {
			throw new Error(
				"Missing Midtrans client key. Set NEXT_PUBLIC_MIDTRANS_CLIENT_KEY in .env",
			);
		}
		await loadSnapScript(clientKey);
		if (!window.snap?.pay) {
			throw new Error("Midtrans Snap did not initialize.");
		}
	}, [clientKey]);

	useEffect(() => {
		if (!clientKey || validLines.length === 0) return;
		loadSnapScript(clientKey).catch(() => {
			/* preload optional — user will see error on pay if load failed */
		});
	}, [clientKey, validLines.length]);

	const disabled = validLines.length === 0 || !clientKey;

	function buildPayload(): PublicOrderInput {
		return {
			customerName: customerName.trim(),
			customerEmail: customerEmail.trim(),
			customerPhone: customerPhone.trim() || undefined,
			shippingAddress: shippingAddress.trim(),
			shippingCity: shippingCity.trim(),
			shippingPostalCode: shippingPostalCode.trim(),
			items: validLines.map((l) => ({
				productId: l.productId,
				quantity: l.quantity,
				...(l.variantId ? { variantId: l.variantId } : {}),
			})),
		};
	}

	function handlePay() {
		setFormError(null);
		const payload = buildPayload();
		if (
			!payload.customerName ||
			!payload.customerEmail ||
			!payload.shippingAddress ||
			!payload.shippingCity ||
			!payload.shippingPostalCode
		) {
			setFormError("Please fill in all required fields.");
			return;
		}

		startTransition(async () => {
			try {
				await ensureSnap();
				const checkoutRes = await postCheckout(payload);
				const token = checkoutRes.data.token;
				if (!token) {
					setFormError("No payment token returned from server.");
					return;
				}
				const snap = window.snap;
				if (!snap?.pay) {
					setFormError("Payment UI did not load. Refresh and try again.");
					return;
				}
				snap.pay(token, {
					onSuccess: async () => {
						await clearCart();
						router.refresh();
					},
					onPending: async () => {
						await clearCart();
						router.refresh();
					},
					onError: () => {
						setFormError("Payment could not be processed. Try again.");
					},
					onClose: () => {
						router.refresh();
					},
				});
			} catch (e) {
				if (isAxiosError(e)) {
					const msg = (e.response?.data as { message?: string })?.message;
					setFormError(
						typeof msg === "string"
							? msg
							: e.response?.statusText || "Checkout request failed.",
					);
				} else if (e instanceof Error) {
					setFormError(e.message);
				} else {
					setFormError("Something went wrong.");
				}
			}
		});
	}

	return (
		<section
			id="checkout"
			className="scroll-mt-24 space-y-4 border border-black bg-cream p-5 md:p-6">
			<div className="space-y-1">
				<h2 className="font-mono text-xl font-semibold tracking-tight">
					Checkout
				</h2>
				<p className="text-sm text-muted-foreground">
					Enter shipping details, then pay securely with Midtrans Snap.
				</p>
			</div>

			<div className="flex flex-wrap items-end justify-between gap-4 border border-black bg-surface px-4 py-3">
				<div>
					<p className="text-xs text-muted-foreground">Subtotal</p>
					<p className="font-mono text-xl font-semibold">
						{formatIdr(subtotal)}
					</p>
				</div>
				{!clientKey ? (
					<p className="text-xs text-destructive">
						Add NEXT_PUBLIC_MIDTRANS_CLIENT_KEY to enable payments.
					</p>
				) : null}
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2 sm:col-span-2">
					<Label htmlFor={`${baseId}-name`}>Full name</Label>
					<Input
						id={`${baseId}-name`}
						name="customerName"
						autoComplete="name"
						value={customerName}
						onChange={(e) => setCustomerName(e.target.value)}
						required
						className="rounded-none border-black"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor={`${baseId}-email`}>Email</Label>
					<Input
						id={`${baseId}-email`}
						name="customerEmail"
						type="email"
						autoComplete="email"
						value={customerEmail}
						onChange={(e) => setCustomerEmail(e.target.value)}
						required
						className="rounded-none border-black"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor={`${baseId}-phone`}>Phone (optional)</Label>
					<Input
						id={`${baseId}-phone`}
						name="customerPhone"
						type="tel"
						autoComplete="tel"
						value={customerPhone}
						onChange={(e) => setCustomerPhone(e.target.value)}
						className="rounded-none border-black"
					/>
				</div>
				<div className="space-y-2 sm:col-span-2">
					<Label htmlFor={`${baseId}-addr`}>Shipping address</Label>
					<Input
						id={`${baseId}-addr`}
						name="shippingAddress"
						autoComplete="street-address"
						value={shippingAddress}
						onChange={(e) => setShippingAddress(e.target.value)}
						required
						className="rounded-none border-black"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor={`${baseId}-city`}>City</Label>
					<Input
						id={`${baseId}-city`}
						name="shippingCity"
						autoComplete="address-level2"
						value={shippingCity}
						onChange={(e) => setShippingCity(e.target.value)}
						required
						className="rounded-none border-black"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor={`${baseId}-postal`}>Postal code</Label>
					<Input
						id={`${baseId}-postal`}
						name="shippingPostalCode"
						autoComplete="postal-code"
						value={shippingPostalCode}
						onChange={(e) => setShippingPostalCode(e.target.value)}
						required
						className="rounded-none border-black"
					/>
				</div>
			</div>

			{formError ? (
				<p className="text-sm font-medium text-destructive" role="alert">
					{formError}
				</p>
			) : null}

			<Button
				type="button"
				disabled={disabled || pending}
				onClick={handlePay}
				className="rounded-none border border-black bg-primary font-mono">
				{pending ? (
					<>
						<Loader2 className="mr-2 size-4 animate-spin" />
						Processing…
					</>
				) : (
					"Pay with Midtrans"
				)}
			</Button>
		</section>
	);
}
