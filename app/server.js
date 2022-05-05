const express = require("express");
const app = express();
const path = require("path");
const request = require('request');
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const config = require('./config');
let db = new Datastore({ filename: './data/nodes.db', autoload: true });

const port = config.port || 3000;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/test", function (req, res) {
    console.log(req);
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/api/v1/nodes", function (req, res) {
    db.find({}, function (err, docs) {
        res.send(docs);
    })
});

app.post("/api/v1/nodes", function (req, res) {
    let data = req.body;

    for (let node of data) {
        db.update({ name: node.instance }, { $set: { pos: node.pos } })
    }
    db.loadDatabase();
    res.send();
});

function queryProm() {

    request(config.prometheus.url + "/api/v1/query?query=probe_success{instance=~'axs-.*|d.*', job='blackbox-ping'}", { json: true }, (err, res, body) => {

        try {
            let data = body.data.result;

            for (let i = 0; i < data.length; i++) {
                let instance = data[i].metric.instance;
                let status = data[i].value[1];

                db.findOne({ name: instance }, (err, result) => {
                    if (result === null) {
                        console.log("Inserting: " + instance);
                        db.insert({
                            name: instance,
                            status: status,
                            pos: {
                                x: null,
                                y: null
                            },
                            updated: Date.now(),
                        })
                    }
                });
                db.update({ name: instance }, { $set: { status: status, updated: Date.now()} });
            }
            db.loadDatabase();

            // Set hanging (no longer monitored) nodes to status 2 (gray)
            let minuteAgo = new Date()
            minuteAgo.setMinutes(minuteAgo.getMinutes() - 2);
            db.find({ updated: { $lt: minuteAgo }, status: {$ne: "2"} }, function (err, oldNodes) {
                oldNodes.forEach(node => {
                    console.log("Decomissioning: " + node.name)
                    db.update({ _id: node._id }, { $set: { status: "2" } })
                });
            });


        } catch (err) {
            console.error(err);
        }
    }

    );
}
setInterval(queryProm, 1000);

app.listen(port);
