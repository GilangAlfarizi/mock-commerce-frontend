"use client";

import * as React from "react";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export type ConfirmDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: "default" | "destructive";
	loading?: boolean;
	onConfirm: () => void | Promise<void>;
};

function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	variant = "default",
	loading,
	onConfirm,
}: ConfirmDialogProps) {
	const [pending, setPending] = React.useState(false);

	const handleConfirm = async () => {
		setPending(true);
		try {
			await onConfirm();
			onOpenChange(false);
		} finally {
			setPending(false);
		}
	};

	const busy = Boolean(loading || pending);

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={busy}>{cancelLabel}</AlertDialogCancel>
					<Button
						type="button"
						variant={variant === "destructive" ? "destructive" : "default"}
						disabled={busy}
						onClick={() => void handleConfirm()}>
						{busy ? "Please wait…" : confirmLabel}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export { ConfirmDialog };
