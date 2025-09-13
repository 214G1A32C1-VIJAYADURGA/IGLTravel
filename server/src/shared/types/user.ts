import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  mobile?: string;
  comparePassword?: (password: string) => Promise<boolean>;
}