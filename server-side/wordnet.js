((wordnet) => {
    'use strict';
    var WordPOS = require('wordpos'),
    _ = require('lodash'),
    wordpos = new WordPOS();

    wordnet.init = async(entities) => {
        let newEntities = {};
        let glossObj = {};

        for(let i=0; i<entities.length; i++) {

            newEntities[entities[i]] = [];
            glossObj[entities[i]] = [];
            await wordpos.lookupNoun(entities[i])
                .then((data)=> {
                    for(let item of data) {
                        newEntities[entities[i]] = [...newEntities[entities[i]] , _.pick(item, ['synonyms', 'gloss'])];
                        glossObj[entities[i]] = [...glossObj[entities[i]], item['gloss']]
                    }                  
                })                

        }
        return [glossObj, newEntities];
    }

    //old method
    // wordnet.init = async(word) => {
    //     let syn = [];
    //     await wordpos.lookupNoun(word)
    //         .then((data) => {
    //             /*  this wordnet library provides a number of synsets in the form of lexName.
    //             */ 
    //             let source = ['WordNet'];
    //             // console.log("data", data);
    //             for(let i=0; i<data.length; i++) {
    //                 console.log("----------------------", data[i]);
    //                 let context = data[i].lexName.replace('noun.', '');
    //                 for(let j=0; j<data[i].synonyms.length; j++) {
    //                     if(data[i].synonyms[j] !== word) {
    //                         let synWord = data[i].synonyms[j];
    //                         synWord = synWord.replace(/\_/g, ' ');
    //                         syn.push({synWord, context, source});
    //                     }
    //                 }
    //             }
    //         })
    //     return syn;
    // }


})(module.exports);