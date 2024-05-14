export type LoginData = {
  email: string;
	password: string;
};

export type SignupData = {
	email: string;
	username: string;
	password1: string;
	password2: string;
};

export type PasswordResetConfirmInputs = {
	uid: string;
	token: string;
	new_password1: string;
	new_password2: string;
};

export type PasswordChangeInputs = {
	new_password1: string;
	new_password2: string;
	old_password: string;
}
