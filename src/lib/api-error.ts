import axios from "axios";

type ApiErrorBody = {
	message?: string;
};

export function getApiErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data as ApiErrorBody | undefined;
		if (data?.message) return data.message;
		return error.message || "Request failed";
	}
	if (error instanceof Error) return error.message;
	return "Something went wrong";
}
