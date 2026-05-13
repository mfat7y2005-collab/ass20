import { HydratedDocument } from "mongoose";
import { IUser } from "../interfaces";
import { JwtPayload } from "jsonwebtoken";




export interface IAuthUser{
    user:HydratedDocument<IUser>,
    decoded:JwtPayload
}