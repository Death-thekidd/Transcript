import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import winston from "winston";
import { SESSION_SECRET, URL_ORIGIN } from "./util/secrets";
import SequelizeStore from "connect-session-sequelize";

// Routes
import routes from "./routers/index.router";

import connection from "./database/connection";
import User from "./database/models/user";

// Create Express server
const app = express();

const whitelist = [
	"https://transcript.dtkapp.com.ng",
	"http://localhost:5173",
	URL_ORIGIN,
];
const corsOptions = {
	origin: function (origin: any, callback: any) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: ["POST", "PATCH", "GET", "DELETE", "OPTIONS", "HEAD"],
	credentials: true,
};

app.use(cors(corsOptions));

// Sync the database
connection
	.authenticate()
	.then(() => {
		console.log("Connected to the database");
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
	});

// Express configuration
app.set("port", process.env.PORT || 3001);
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const sessionStore = new (SequelizeStore(session.Store))({
	db: connection, // Use your Sequelize instance
	tableName: "sessions", // Table name to store sessions in your database
});

app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: SESSION_SECRET,
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 30,
		},
	})
);

sessionStore.sync();

app.use(passport.initialize());
app.use(passport.session());

// Define middleware to refresh session expiration
function refreshSession(req: Request, res: Response, next: NextFunction) {
	if (req.session) {
		req.session.touch();
	}
	next();
}

// Apply the refreshSession middleware globally
app.use(refreshSession);

const logger = winston.createLogger({
	transports: [
		new winston.transports.File({ filename: "error.log", level: "error" }),
	],
});

/**
 * Primary app routes.
 */
app.get("/", (req: Request, res: Response) => {
	if (req?.user) {
		return res.json({ valid: true, userId: (req?.user as User)?.id });
	} else {
		return res.json({ valid: false, user: req?.isAuthenticated() });
	}
});

app.use(routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	if (!res.headersSent) {
		logger.error(err.message);
		res.status(err.status || 500).json({ error: err.message });
	}
});

export default app;
