const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

const dbConnector = require('./database-connector');
// const relation = require('./realtionship');
const synonym = require('./synonym');

dbConnector.init(app);
// relation.init(app);

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', router);
router.route('/paraphase').post(function(req, res) {
    synonym.init(app, req, res);
})

module.exports = app;

