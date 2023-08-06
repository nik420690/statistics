const express = require('express');
const cors = require('cors');
const StatisticModel = require("./DB/Models/Statistic");
const swaggerSetup = require('./swagger');
const dbConnection = require("./DB/dbConn");

const app = express();
const port = process.env.PORT || 3035;

dbConnection;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.route("/add-statistic")
    .post(async (req, res) => {
        const { service, endpoint } = req.body;
        const stat = new StatisticModel({ service, endpoint });
        try {
            await stat.save();
            res.json({ error: false, message: "Successfully updated statistic collection." });
        } catch (e) {
            res.status(500).json({ error: true, message: "Something went wrong." });
        }
    });

app.route("/last-called-endpoint")
    .get(async (req, res) => {
        try {
            const lastStat = await StatisticModel.findOne({}, {}, { sort: { _id: -1 } });
            res.json({ error: false, Last_Called_Endpoint: lastStat.endpoint, service: lastStat.service });
        } catch (e) {
            res.status(500).json({ error: true, message: "Something went wrong." });
        }
    });

app.route("/frequently-called-service")
    .get(async (req, res) => {
        try {
            const stats = await StatisticModel.find({});
            const serviceCount = stats.reduce((acc, curr) => {
                acc[curr.service] = (acc[curr.service] || 0) + 1;
                return acc;
            }, {});

            const mostCalledService = Object.keys(serviceCount).reduce((a, b) => serviceCount[a] > serviceCount[b] ? a : b);
            res.json({ error: false, Frequently_Called_Service: mostCalledService });
        } catch (e) {
            res.status(500).json({ error: true, message: "Something went wrong." });
        }
    });

app.route("/number-of-indviduals-calls")
    .get(async (req, res) => {
        try {
            const stats = await StatisticModel.find({});
            const callCounts = stats.reduce((acc, curr) => {
                if (!acc[curr.service]) acc[curr.service] = {};
                acc[curr.service][curr.endpoint] = (acc[curr.service][curr.endpoint] || 0) + 1;
                return acc;
            }, {});
            res.json({ error: false, countOf_individuals_calls: callCounts });
        } catch (e) {
            res.status(500).json({ error: true, message: "Something went wrong." });
        }
    });

swaggerSetup(app);

app.listen(port, () => console.log(`Server running at port: ${port}`));
