((wordnet) => {
    'use strict';
    var WordPOS = require('wordpos'),
    _ = require('lodash'),
    wordpos = new WordPOS();

    // finds synonym from wordnet database
    async function findSynonym(entity) {
        let syn = [];
        await wordpos.lookupNoun(entity)
            .then((data)=> {
                syn = data.map(item => {
                    let synonym = _.pick(item, ['synonyms', 'gloss']);
                    synonym.entity = entity;
                    return synonym;
                })                
            })
            .catch((err) => console.log("err", err))
        return syn;     

    }

    // compares synonyms from conceptnet with synonyms from wordnet
    // unique/extra synonyms from wordnet are saved
    function compareWordnetConceptNet(wordNetData, conceptNetData) {
        
        let difference = {};
        for(let prop in conceptNetData) {
            let synonym = conceptNetData[prop];
            for(let item of wordNetData) {
                if(item.entity === prop) 
                    synonym = synonym.filter(x => !item.synonyms.includes(x));
            }
            difference[prop] = synonym
        }
        return difference;
    }

    // database beside WordNet (i.e. ConceptNet) doesn't provide sense definition
    // this function gets definition of such senses from wordnet
    // it chooses the first default sense definition provided by wordnet
    async function addGloss(differentSyn) {
        let syn = [];
        for(let prop in differentSyn) {
            for(let item of differentSyn[prop]) {
                await wordpos.lookupNoun(item)
                .then((data)=> {
                    syn.push({
                        synonyms: [item],
                        gloss: data[0].gloss,
                        entity: prop
                    })
                })
                .catch((err) => console.log("err", err))
            }
        }  
        return syn;   
    }

    wordnet.init = async(entities, conceptNetData) => {
        let syn = [];
        for(let entity of entities) {
            syn = [...syn, ...await findSynonym(entity)]
        }
        if(conceptNetData) {
            let differentSyn = await compareWordnetConceptNet(syn, conceptNetData);
            syn = [...syn, ...await addGloss(differentSyn)];
        }
        return syn;
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