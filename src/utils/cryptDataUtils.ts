import Cryptr from "cryptr";

const { CRYPTR_SECRET_KEY } = process.env;

const cryptr = new Cryptr(CRYPTR_SECRET_KEY);

export const encryptData = (data: string): string => cryptr.encrypt(data);
export const decryptData = (data: string): string => cryptr.decrypt(data);
