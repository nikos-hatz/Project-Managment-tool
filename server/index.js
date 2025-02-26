import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createHmac } from "crypto";
import { handleClockIn, handleClockOut, handleSlackAccountLinking, handleTakeBreak, handleEndBreak } from "./slackCommands.js";
import reportRoutes from "./routes/reportRoutes.js"
import chatRoutes from "./routes/chatRoutes.js";
import filesRoutes from './routes/filesRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to capture raw body for signature validation
const rawBodySaver = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};
app.use(cors());
// Configure body-parser with rawBodySaver
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.json({ verify: rawBodySaver }));

// Middleware for Slack request validation
const validateSlackRequest = (req, res, next) => {
    const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
    const timestamp = req.headers["x-slack-request-timestamp"];
    const signature = req.headers["x-slack-signature"];

    console.log("Slack Signing Secret:", slackSigningSecret);
    console.log("Timestamp:", timestamp);
    console.log("Signature:", signature);

    if (!slackSigningSecret || !timestamp || !signature) {
        console.error("Missing Slack headers or signing secret.");
        return res.status(400).json({ message: "Request validation failed." });
    }

    const sigBasestring = `v0:${timestamp}:${req.rawBody}`;
    const calculatedSignature = `v0=${createHmac("sha256", slackSigningSecret)
        .update(sigBasestring)
        .digest("hex")}`;

    console.log("Expected Signature:", calculatedSignature);
    console.log("Received Signature:", signature);

    if (
        Math.abs(Date.now() / 1000 - timestamp) > 300 || 
        signature !== calculatedSignature
    ) {
        console.error("Slack request validation failed.");
        return res.status(400).json({ message: "Request validation failed." });
    }

    next();
};
// Slack Slash Command Endpoint
app.post(
    "/slack/commands",
    validateSlackRequest,
    async (req, res) => {
        const { command} = req.body;
        console.log(req.body)

        try {
            if (command === "/clockin") {
                await handleClockIn(req, res);
            } else if (command === "/clockout") {
                await handleClockOut(req, res);
            } else if (command === "/linkaccount") {
                await handleSlackAccountLinking(req, res)
            }
            else if (command === "/break") {
                await handleTakeBreak(req, res)
            }
            else if (command === "/endbreak") {
                await handleEndBreak(req, res)
            }
             else {
                res.send({
                    response_type: "ephemeral",
                    text: "Unknown command."
                });
            }
        } catch (error) {
            console.error("Error processing command:", error);
            if (!res.headersSent) {
                res.send({
                    response_type: "ephemeral",
                    text: "An error occurred while processing your command."
                });
            }
        }
    }
);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});