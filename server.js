const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let teams = [
    {
        _id: 1,
        name: "New England Patriots",
        city: "Foxborough",
        logo: "patriots_logo.png",
        superBowlWins: 6,
        players: ["Tom Brady", "Rob Gronkowski", "Julian Edelman"],
        stadium: "Gillette Stadium",
    },
    {
        _id: 2,
        name: "Kansas City Chiefs",
        city: "Kansas City",
        logo: "chiefs_logo.png",
        superBowlWins: 2,
        players: ["Patrick Mahomes", "Travis Kelce", "Tyreek Hill"],
        stadium: "Arrowhead Stadium",
    },
    {
        _id: 3,
        name: "San Francisco 49ers",
        city: "San Francisco",
        logo: "49ers_logo.png",
        superBowlWins: 5,
        players: ["Jimmy Garoppolo", "George Kittle", "Deebo Samuel"],
        stadium: "Levi's Stadium",
    },
    {
        _id: 4,
        name: "Dallas Cowboys",
        city: "Dallas",
        logo: "cowboys_logo.png",
        superBowlWins: 5,
        players: ["Dak Prescott", "Ezekiel Elliott", "Amari Cooper"],
        stadium: "AT&T Stadium",
    },
    {
        _id: 5,
        name: "Green Bay Packers",
        city: "Green Bay",
        logo: "packers_logo.png",
        superBowlWins: 4,
        players: ["Aaron Rodgers", "Davante Adams", "Aaron Jones"],
        stadium: "Lambeau Field",
    },
    {
        _id: 6,
        name: "New York Jets",
        city: "New York",
        logo: "jets_logo.png",
        superBowlWins: 1,
        players: ["Zach Wilson", "C.J. Mosley", "Corey Davis"],
        stadium: "MetLife Stadium",
    },
];

app.get("/api/teams", (req, res) => {
    res.send(teams);
});

app.post("/api/teams", upload.single("img"), (req, res) => {
    const result = validateTeam(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const team = {
        _id: teams.length + 1,
        name: req.body.name,
        city: req.body.city,
        logo: req.body.logo,
        superBowlWins: req.body.superBowlWins,
        players: req.body.players.split(","),
        stadium: req.body.stadium,
    };

    teams.push(team);
    res.send(teams);
});

app.put("/api/teams/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const teamIndex = teams.findIndex((t) => t._id === id);

    if (teamIndex === -1) {
        res.status(404).send("The team was not found");
        return;
    }

    const result = validateTeam(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const team = teams[teamIndex];
    team.name = req.body.name;
    team.city = req.body.city;
    team.logo = req.body.logo;
    team.superBowlWins = req.body.superBowlWins;
    team.players = req.body.players.split(",");
    team.stadium = req.body.stadium;

    if (req.file) {
        team.logo = "images/" + req.file.filename;
    }

    res.send(team);
});

app.delete("/api/teams/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const teamIndex = teams.findIndex((t) => t._id === id);

    if (teamIndex === -1) {
        res.status(404).send("The team was not found");
        return;
    }

    const deletedTeam = teams[teamIndex];
    teams.splice(teamIndex, 1);
    res.send(deletedTeam);
});

const validateTeam = (team) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        players: Joi.allow(""),
        name: Joi.string().min(3).required(),
        city: Joi.string().min(3).required(),
        logo: Joi.string().min(3).required(),
        superBowlWins: Joi.number().min(0).required(),
        stadium: Joi.string().min(3).required(),
    });

    return schema.validate(team);
};

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});