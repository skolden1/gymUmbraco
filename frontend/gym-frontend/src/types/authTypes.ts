export type LoginDto = {
  emailDto: string,
  passwordDto: string
}

export type LoginResponse = {
  token: string;
}

export type RegisterDto = {
  emailDto: string,
  passwordDto: string,
  repeatPasswordDto: string
}