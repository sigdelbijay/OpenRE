((synonym) => {
    'use strict';

    var WordPOS = require('wordpos'),
    wordpos = new WordPOS(),
    wordnet = require('./wordnet'),
    conceptnet = require('./conceptnet'),
    diff = require('diff'),
    _ = require('lodash'),
    stringLib = require('./string-lib');


    synonym.init = (app, req, res) => {

        setTimeout(function() {
            main();
        }, 1500)

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

        function main() {
            let questionArray, paragraph;
            let finalResult = [];
            console.log("req.body", req.body);
            paragraph = req.body.paragraph;
            questionArray = JSON.parse(req.body.questionArr);
            for(let i=0; i<questionArray.length; i++) {
                console.log(`question ${i}`, questionArray[i]);
                wordpos.getNouns(questionArray[i])
                .then(async(result) => {
                    // if(!result && !result.length) res.status(400);
                    //omit proper noun
                    let entities = result.filter((item) => !(/^[A-Z]/.test(item)));
                    console.log("entitties", entities);
    
                    let response = await getSynonym(entities, paragraph);
                    let synonymObj = response[0];                   
                    let find = [], replace = [];
                    for(let values in synonymObj) {
                        //filter if synonyms are represented as numbers
                        synonymObj[values] = synonymObj[values].filter(x => isNaN(x));
                        find.push(values);
                        replace.push(synonymObj[values]);
                    }
    
                    let replaceCombination = await cartesian(...replace);
                    let newQuestions = [];
                    for(let item of replaceCombination) {
                        if(!Array.isArray(item)) item = [item]
                        newQuestions.push(questionArray[i].replaceArray(find, item));
                    }

                    finalResult.push({
                        question: questionArray[i],
                        entities,
                        newQuestions,
                        stats: response[1]
                    })
                    if(finalResult.length === questionArray.length) {
                        res.status(200).json({
                            paragraph,
                            finalResult
                        });
                    }
                })
            }
        }
    }

})(module.exports);