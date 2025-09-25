import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

// export enum TokenStatus {
//   TOKEN_VALID = "TOKEN_VALID",
//   TOKEN_EXPIRED = "TOKEN_EXPIRED",
//   TOKEN_INVALID = "TOKEN_INVALID",
//   TOKEN_NOT_FOUND = "TOKEN_NOT_FOUND",
// }

//---------------------------------------

export const comparePassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compareSync(password, hashPassword);
};

export const hashPassword = (password: string) => {
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};
