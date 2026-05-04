import { api } from "@/services/axios";
import type { AuthUserResponse, LoginInput } from "@/types/auth";

export async function login(input: LoginInput): Promise<AuthUserResponse> {
	const { data } = await api.post<AuthUserResponse>("/login", input);
	return data;
}
