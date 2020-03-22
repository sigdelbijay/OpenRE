((synonym) => {
    'use strict';

    var WordPOS = require('wordpos'),
    wordpos = new WordPOS(),
    wordnet = require('./wordnet'),
    diff = require('diff'),
    _ = require('lodash');


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
        async function getSynonym(entities) {
            let diffArr;
            let synonymObj = {};
            const wordNetData =  await wordnet.init(entities);
            console.log("wordnetdata", wordNetData[1]);
            for(let glosses in wordNetData[0]) {
                // console.log("------gloss entity----------------------------------------------", glosses);
                for(let gloss of wordNetData[0][glosses]){
                    // if an entity has only one meaning/sense/gloss means it is already context-aware
                    // so, no need for comparison
                    if(gloss.length == 1) {
                        synonymObj[glosses] = gloss;
                        break;
                    }
                    for (let entity in wordNetData[1]){
                        // comparing gloss of one entity only with the senses of other entity
                        if(entity === glosses) continue;
                        // console.log("------syn entity--------------------------------------------", entity);
                        for(let prop of wordNetData[1][entity]){
                            for(let syn of prop.synonyms) {
                                diffArr = await diff.diffWords(gloss, syn);

                                // length 3 in diff module comparison result means there is a overlap
                                if(diffArr.length === 3) {
                                    // if one sense of a word in a question is connected to sense of another word
                                    // in the same question, then it gives the sense of both word
                                    // for one word we already have sense, for another word we have gloss and we will employ gloss its sense
                                    synonymObj[glosses] = gloss;                                    
                                    if(!synonymObj[entity]) synonymObj[entity] = prop.synonyms; 
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            // finding synonym using gloss
            let synonymObjKeys = Object.keys(synonymObj);
            if(synonymObj && synonymObjKeys.length) {
                for(let item in synonymObj) {
                    // if sense of an entity is still in gloss form it is in string(not Array)
                    // we are finding associate synonym of gloss, i.e. an Array
                    if(!Array.isArray(synonymObj[item])){
                        for (let entity in wordNetData[1]){
                            for(let prop of wordNetData[1][entity]){
                                if(prop.gloss === synonymObj[item]) {
                                    synonymObj[item] = prop.synonyms
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            // if there is no overlap (between the gloss of one word and senses of other word)
            // we assign the first sense as the best sense to all such words
            let uncapturedEntities = _.xor(entities, synonymObjKeys);
            for (let entity in wordNetData[1]){
                if(!uncapturedEntities.includes(entity)) continue;
                synonymObj[entity] = wordNetData[1][entity][0].synonyms;
                
                //wordnet sometimes gives number as synonym, to remove such numbers
                synonymObj[entity] = synonymObj[entity].filter(x => isNaN(x));
            }
            return [synonymObj, wordNetData[1]];
        }

        function main() {
            let x = {};
            let question, entities, newQuestion;
            question = req.body.question;
            console.log("question is: ", question);
            wordpos.getNouns(question)
                .then(async(result) => {
                    if(!result && !result.length) res.status(400);
                    //omit proper noun
                    entities = result.filter((item) => !(/^[A-Z]/.test(item)));
                    let response = await getSynonym(entities);
                    let synonymObj = response[0];
                    
                    let find = [], replace = [];
                    for(let values in synonymObj) {
                        find.push(values);
                        replace.push(synonymObj[values]);
                    }

                    // function for getting cartesian product of arrays
                    const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
                    const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

                    let replaceCombination = cartesian(...replace);
                    let newQuestions = [];
                    for(let item of replaceCombination) {
                        if(!Array.isArray(item)) item = [item]
                        newQuestions.push(question.replaceArray(find, item));
                    }
                    res.status(200).json({
                        question,
                        entities,
                        newQuestions,
                        stats: response[1]
                    });
                    console.log("New Questions are: ", newQuestions);

                })
        }
    }

})(module.exports);