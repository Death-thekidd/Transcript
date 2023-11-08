import { Privilege } from "../models/privilege.model";
import sequelize from "../sequelize";

// Define an array of privileges to seed
const privilegesToSeed = [
	{
		name: "Dashboard",
		path: "/app",
	},
	{
		name: "Admin Dashboard",
		path: "/app/admin-dashboard",
	},
	{
		name: "Users",
		path: "/app/users",
	},
	{
		name: "Colleges",
		path: "/app/colleges",
	},
	{
		name: "Departments",
		path: "/app/departments",
	},
	{
		name: "Destinations",
		path: "/app/destinations",
	},
	{
		name: "Destination requests",
		path: "/app/destination-requests",
	},
	{
		name: "Transcript requests",
		path: "/app/transcript-requests",
	},
	{
		name: "Roles",
		path: "/app/roles",
	},
	{
		name: "Request Transcript",
		path: "/app/request-transcript",
	},
	{
		name: "Request Destination",
		path: "/app/request-destination",
	},
	{
		name: "Transcript Types",
		path: "/app/transcript-types",
	},
];

// Function to seed privileges into the database
export async function seedPrivileges(): Promise<void> {
	try {
		// Synchronize the model with the database
		await sequelize.sync();

		// Insert privileges into the database
		for (const privilege of privilegesToSeed) {
			await Privilege.create(privilege);
			console.log(`Privilege '${privilege.name}' seeded.`);
		}

		console.log("Privileges seeding completed.");
	} catch (error) {
		console.error("Error seeding privileges:", error);
	} finally {
		// Close the database connection
		await sequelize.close();
	}
}
