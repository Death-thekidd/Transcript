import { Request, Response, NextFunction } from "express";
import User from "../database/models/user";
import Role from "../database/models/role";

export const checkUserRole = (_role: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const user: User = req.session.user as User; // Assuming you store user information in the request object after authentication
		const role = await Role.findOne({ where: { name: _role } });
		const roles = await user.getRoles();
		if (!user || !roles.includes(role)) {
			return res.status(403).json({ message: "Access forbidden" });
		}
		next();
	};
};
