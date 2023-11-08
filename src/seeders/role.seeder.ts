import { Privilege } from "../models/privilege.model";
import { Role } from "../models/role.model";
import sequelize from "../sequelize";

export async function seedRolesAndPrivileges(): Promise<void> {
	try {
		// Synchronize the models with the database
		await sequelize.sync();

		// Define the roles and their associated privilege names
		const rolesWithPrivileges = [
			{
				name: "Admin",
				privileges: [
					"Admin Dashboard",
					"Users",
					"Colleges",
					"Departments",
					"Destinations",
					"Destination requests",
					"Transcript requests",
					"Transcript Types",
					"Roles",
				],
			},
			{
				name: "User",
				privileges: ["Dashboard", "Request Transcript", "Request Destination"],
			},
		];

		for (const roleData of rolesWithPrivileges) {
			// Create the role
			const role = await Role.findOrCreate({
				where: { name: roleData.name },
				defaults: { name: roleData.name },
			});

			// Assign privileges by name
			for (const privilegeName of roleData.privileges) {
				const privilege = await Privilege.findOne({
					where: { name: privilegeName },
				});
				if (privilege) {
					await role[0].addPrivilege(privilege);
				}
			}
		}

		console.log("Roles and privileges seeding completed.");
	} catch (error) {
		console.error("Error seeding roles and privileges:", error);
	}
}
