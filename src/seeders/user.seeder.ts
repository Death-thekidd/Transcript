import { createUser } from "../controllers/user.controller";
import sequelize from "../sequelize";
// Function to seed user data
export async function seedUsers(): Promise<void> {
	try {
		// Synchronize the models with the database
		await sequelize.sync();

		// Define user data for seeding
		const usersToSeed = [
			{
				email: "ohiemidivine7@gmail.com",
				password: "password123",
				name: "Transcript Admin",
				schoolId: "99999",
				roles: ["Admin"],
				userType: "Staff",
			},
		];

		for (const userData of usersToSeed) {
			// Create the user
			await createUser(userData);
		}

		console.log("User seeding completed.");
	} catch (error) {
		console.error("Error seeding users:", error);
	}
}
