((synonym) => {
    'use strict';

    var WordPOS = require('wordpos'),
    wordpos = new WordPOS(),
    wordnet = require('./wordnet'),
    conceptnet = require('./conceptnet'),
    diff = require('diff'),
    _ = require('lodash'),
    stringLib = require('./string-lib');

    String.prototype.replaceArray = function(find, replace) {
        var replaceString = this;
        for (var i = 0; i < find.length; i++) {
          replaceString = replaceString.replace(find[i], replace[i]);
        }
        return replaceString;
    };

    // function for getting context aware synonym
    async function getSynonym(entities, paragraph) {
        const conceptNetData =  await conceptnet.init(entities);
        const wordNetData =  await wordnet.init(entities, conceptNetData);
        const paragraphSentence = stringLib.locator(entities, paragraph);
        const comparisonResult = stringLib.comparator(paragraphSentence, wordNetData);

        let temp = {},
            syn = {};
        for(let x of comparisonResult) {
            if(x.overlapCount) {
                let tempKeys = Object.keys(temp);
                if(tempKeys.length && tempKeys.includes[x.entity] && temp[x.entity] > x.overlapCount) continue;
                else {
                    temp[x.entity] = x.overlapCount;
                    syn[x.entity] = x.synonyms                
                }
            } 
        }

        //find synonyms for missing entities (entities without overlap) from wordnet
        //take the first synonym provided by wordnet
        let synKeys = Object.keys(syn);
        const diff = entities.filter(x => !synKeys.includes(x));
        if(diff) {
            const newSyn = await wordnet.init(diff);
            for(let x of diff) {
                let z = newSyn.find(y => y.entity === x)
                syn[x] = z.synonyms
            }
        }
        return [syn, wordNetData];
    }
    
    // function for getting cartesian product of arrays
    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
    const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

    synonym.init = async(app, req, res) => {

        // setTimeout(function() {
        //     // main();
        // }, 1500)



        // function main() {
            let paragraph = (req && req.body) ? req.body.paragraph : app.locals.paragraph;
            let questionArr = (req && req.body) ? JSON.parse(req.body.questionArr) : app.locals.questionArr;
            let finalResult;
            if(req && req.body)  finalResult = [];
            else finalResult = "";

            for(let i=0; i<questionArr.length; i++) {
                console.log("question", questionArr[i]);
                if(req && req.body) {
                    console.log("-------------******************----------------------")
                    wordpos.getNouns(questionArr[i])
                    .then(async(result) => {
                        //omit proper noun
                        let entities = result.filter((item) => !(/^[A-Z]/.test(item)));
                        let response = await getSynonym(entities, paragraph);
                        let synonymObj = response[0];   
                        console.log("synonymObj", synonymObj);     
                        let find = [], replace = [];
                        for(let values in synonymObj) {
                            //filter if synonyms are represented as numbers
                            synonymObj[values] = synonymObj[values].filter(x => isNaN(x));
                            //filter if synonyms have original word
                            if(synonymObj[values].length > 1) synonymObj[values] = synonymObj[values].filter(x => x !== values);
                            //remove underscore between words
                            synonymObj[values] = synonymObj[values].map(x => x.replace(/_/, ' '));
                            find.push(values);
                            replace.push(synonymObj[values]);
                        }
                        console.log("replace", replace);
                        let replaceCombination;
                        if(replace.length > 1) replaceCombination = await cartesian(...replace);
                        else replaceCombination = replace;
                        // let replaceCombination = await cartesian(...replace);
                        console.log("replaceCombination", replaceCombination);
                        let newQuestions = [];
                        for(let item of replaceCombination) {
                            if(!Array.isArray(item)) item = [item]
                            newQuestions.push(questionArr[i].replaceArray(find, item));
                        }
                        
                        if(req && req.body) {
                            finalResult.push({
                                question: questionArr[i],
                                entities,
                                newQuestions,
                                stats: response[1]
                            });
                            if(finalResult.length === questionArr.length) res.status(200).json({paragraph,finalResult});
                        } else {
                            finalResult = newQuestions[0];
                            return finalResult;
                        }
                    });
                } else {
                    console.log("-------------#################----------------------")
                    return await wordpos.getNouns(questionArr[i])
                    .then(async(result) => {
                        // if(!result && !result.length) res.status(400);
                        //omit proper noun
                        let entities = result.filter((item) => !(/^[A-Z]/.test(item)));
                        if(!entities.length) return finalResult = questionArr[i];
                        // console.log("entities ", entities);  
                        let response = await getSynonym(entities, paragraph);
                        let synonymObj = response[0];   
                        // console.log("synonymObj", synonymObj);                
                        let find = [], replace = [];
                        for(let values in synonymObj) {
                            //filter if synonyms are represented as numbers
                            synonymObj[values] = synonymObj[values].filter(x => isNaN(x));
                            //filter if synonyms have original word
                            if(synonymObj[values].length > 1) synonymObj[values] = synonymObj[values].filter(x => x !== values);
                            // console.log("synonymObj values", synonymObj[values]);
                            find.push(values);
                            replace.push(synonymObj[values]);
                        }
                        // console.log("replace", replace);
                        let replaceCombination;
                        if(replace.length > 1) replaceCombination = await cartesian(...replace);
                        else replaceCombination = replace;
                        console.log("replace combination", replaceCombination);
                        let newQuestions = [];
                        for(let item of replaceCombination) {
                            if(!Array.isArray(item)) item = [item]
                            newQuestions.push(questionArr[i].replaceArray(find, item));
                        }
                        
                        if(req && req.body) {
                            finalResult.push({
                                question: questionArr[i],
                                entities,
                                newQuestions,
                                stats: response[1]
                            });
                            if(finalResult.length === questionArr.length) res.status(200).json({paragraph,finalResult});
                        } else {
                            console.log("newQuestionsArr", newQuestions);
                            finalResult = newQuestions[0];
                            return finalResult;
                        }
                    });
                }

            }
        // }
    }

})(module.exports);