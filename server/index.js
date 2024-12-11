const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));

// Slack Slash Command Endpoint
app.post("/slack/commands", (req, res) => {
    const { command, user_id, text } = req.body;

    if (command === "/clockin") {
        console.log(req.body); // Check incoming data from Slack
        res.send(`User <@${user_id}> clocked in.`);
    } else if (command === "/clockout") {
        res.send(`User <@${user_id}> clocked out.`);
    } else {
        res.send("Unknown command.");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
