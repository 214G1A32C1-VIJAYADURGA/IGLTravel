import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../../modules/users/user.model";
import { Types } from "mongoose";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string, {algorithms: ["HS256"],}) as { id: string };
      const user = await User.findById(decoded.id).select("_id name email");
      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }
      req.user = { _id: user._id, name: user.name, email: user.email };
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};