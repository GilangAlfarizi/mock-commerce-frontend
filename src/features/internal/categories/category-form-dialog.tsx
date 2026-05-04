"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api-error";
import type { AdminCategoryDTO } from "@/types/admin/category";

type CategoryFormBodyProps = {
	mode: "create" | "edit";
	defaultName: string;
	isPending: boolean;
	error: unknown | null;
	onSubmit: (name: string) => void;
	onCancel: () => void;
};

function CategoryFormBody({
	mode,
	defaultName,
	isPending,
	error,
	onSubmit,
	onCancel,
}: CategoryFormBodyProps) {
	const [name, setName] = React.useState(defaultName);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) return;
		onSubmit(trimmed);
	};

	return (
		<form onSubmit={handleSubmit}>
			<DialogHeader>
				<DialogTitle>
					{mode === "create" ? "New category" : "Edit category"}
				</DialogTitle>
				<DialogDescription>
					Slug is generated on the server when you save. You only need a display
					name.
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-2 py-2">
				<Label htmlFor="category-name">Name</Label>
				<Input
					id="category-name"
					name="name"
					autoComplete="off"
					value={name}
					onChange={(e) => setName(e.target.value)}
					disabled={isPending}
					placeholder="e.g. Outerwear"
					required
				/>
				{error ? (
					<p className="text-sm text-destructive" role="alert">
						{getApiErrorMessage(error)}
					</p>
				) : null}
			</div>
			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					disabled={isPending}
					onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={isPending}>
					{isPending ? "Saving…" : mode === "create" ? "Create" : "Save"}
				</Button>
			</DialogFooter>
		</form>
	);
}

export type CategoryFormDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: "create" | "edit";
	initial?: AdminCategoryDTO | null;
	isPending: boolean;
	error: unknown | null;
	onSubmit: (name: string) => void;
};

function CategoryFormDialog({
	open,
	onOpenChange,
	mode,
	initial,
	isPending,
	error,
	onSubmit,
}: CategoryFormDialogProps) {
	const defaultName = mode === "edit" && initial ? initial.name : "";
	const formKey = `${mode}-${initial?.id ?? "new"}`;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={!isPending}>
				{open ? (
					<CategoryFormBody
						key={formKey}
						mode={mode}
						defaultName={defaultName}
						isPending={isPending}
						error={error}
						onSubmit={onSubmit}
						onCancel={() => onOpenChange(false)}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	);
}

export { CategoryFormDialog };
