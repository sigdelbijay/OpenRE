((createNewJson) => {
    'use strict';
    var fs = require("fs");
    const synonym = require('./synonym');
    createNewJson.init = async(app, req, res) => {
        var body = req.body;
        if(!req.body || !req.body.old) return res.status(400).send("Invalid parameters");
        let data = JSON.parse(req.body.old);
        for(let article of data.data) {
            for(let paragraphs of article.paragraphs) {
                app.locals.paragraph = paragraphs.context;
                for(let questions of paragraphs.qas) {
                    app.locals.questionArr = [];
                    app.locals.questionArr.push(questions.question);
                    let questionObj = await synonym.init(app);
                    questions.question = questionObj;

                }
            }
        }
        fs.writeFileSync("dev-v2.0.json", JSON.stringify(data), (err) => {
            if (err) console.log(err);
            console.log("Successfully Written to File.");
        });
        res.download('./dev-v2.0.json', 'dev-v2.0.json');
    };

})(module.exports);
