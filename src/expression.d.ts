// express-session.d.ts

import session from "express-session";

declare module "express-session" {
	interface SessionData {
		userId?: string; // Add your custom properties here
		// Add any other custom properties you may need
	}
}
