/** Mirrors `dto.LoginInput` / auth responses in `docs/swagger.json`. */

export type LoginInput = {
	email: string;
	password: string;
};

export type UserRole = string;

export type UserDTO = {
	id: string;
	email: string;
	name: string;
	role: UserRole;
};

export type UserAuthData = {
	token: string;
	user: UserDTO;
};

export type AuthUserResponse = {
	data: UserAuthData;
	message: string;
};
