const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

const dbConnector = require('./database-connector');
// const relation = require('./realtionship');
const synonym = require('./synonym');
const createNewJson = require('./create-new-json');

dbConnector.init(app);
// relation.init(app);

app.use(cors());
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/', router);
router.route('/paraphase').post(function(req, res) {
    synonym.init(app, req, res);
})
router.route('/createNewJson').post(function(req, res) {
    createNewJson.init(app, req, res);
})
router.route('/dwnldfile').post(function(req, res) {
    res.download('./dev-v2.0.json', 'dev-v2.0.json');
})

module.exports = app;

