"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const winston_1 = __importDefault(require("winston"));
const secrets_1 = require("./util/secrets");
const connect_session_sequelize_1 = __importDefault(require("connect-session-sequelize"));
// Routes
const index_router_1 = __importDefault(require("./routers/index.router"));
const connection_1 = __importDefault(require("./database/connection"));
// Create Express server
const app = express_1.default();
const whitelist = [
    "https://transcript.dtkapp.com.ng",
    "http://localhost:5173",
    secrets_1.URL_ORIGIN,
];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["POST", "PATCH", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
};
app.use(cors_1.default(corsOptions));
// Sync the database
connection_1.default
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
app.use(express_1.default.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express_1.default.urlencoded({ extended: true }));
const sessionStore = new (connect_session_sequelize_1.default(express_session_1.default.Store))({
    db: connection_1.default,
    tableName: "sessions", // Table name to store sessions in your database
});
app.use(express_session_1.default({
    resave: false,
    saveUninitialized: false,
    secret: secrets_1.SESSION_SECRET,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 30,
    },
}));
sessionStore.sync();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Define middleware to refresh session expiration
function refreshSession(req, res, next) {
    if (req.session) {
        req.session.touch();
    }
    next();
}
// Apply the refreshSession middleware globally
app.use(refreshSession);
const logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.File({ filename: "error.log", level: "error" }),
    ],
});
/**
 * Primary app routes.
 */
app.get("/", (req, res) => {
    var _a;
    if (req === null || req === void 0 ? void 0 : req.user) {
        return res.json({ valid: true, userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id });
    }
    else {
        return res.json({ valid: false, user: req === null || req === void 0 ? void 0 : req.isAuthenticated() });
    }
});
app.use(index_router_1.default);
app.use((err, req, res, next) => {
    if (!res.headersSent) {
        logger.error(err.message);
        res.status(err.status || 500).json({ error: err.message });
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map