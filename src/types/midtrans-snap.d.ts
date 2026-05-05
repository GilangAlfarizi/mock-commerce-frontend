export type MidtransSnapCallbacks = {
	onSuccess?: (result: unknown) => void;
	onPending?: (result: unknown) => void;
	onError?: (result: unknown) => void;
	onClose?: () => void;
};

declare global {
	interface Window {
		snap?: {
			pay: (
				token: string,
				options?: MidtransSnapCallbacks,
			) => void;
		};
	}
}

export {};
