// routes/privilegeRoutes.ts
import { Router } from "express";
import { body } from "express-validator";
import * as privilegeController from "../controllers/privilege.controller";

const router = Router();

router.get("/privileges", privilegeController.getPrivileges);
router.get("/privilege/:id", privilegeController.getPrivilege);
router.post(
	"/create-privilege",
	body("name").notEmpty().withMessage("Name is required"),
	privilegeController.createPrivilege
);
router.patch(
	"/add-privilege",
	body("roleName").notEmpty().withMessage("Role name is required"),
	body("assignedPrivileges")
		.isArray()
		.withMessage("Privileges should be an array"),
	privilegeController.addPrivilegeToRole
);

export default router;
