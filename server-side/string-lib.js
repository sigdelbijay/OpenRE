((stringLib) => {
    const stopwords = require('./stopwords.json');
    'use strict';

    stringLib.locator = (entities, paragraph) => {
        const sentences = paragraph.split(/[\\.!\?]/);
        let matchingSentence = sentences.filter(sentence => {
            let matched = false;
            for(let entity of entities) {
                if(sentence.toLowerCase().split(' ').includes(entity)) {
                    matched = true;
                    break;
                }
            }
            if(matched) return true
                else false;
        }).join('');
        return matchingSentence;
    }

    stringLib.comparator = (paragraphSentence, wordNetData) => {
        let paragraphArr = paragraphSentence.replace(/[^a-zA-Z0-9 ']/gi, '')
            .split(' ').filter(e => e).filter(e => !stopwords.words.includes(e));
            let count = 0;

        for(let x of wordNetData) {
            let glossArr = x.gloss.replace(/[^a-zA-Z0-9 ']/gi, '')
                .split(' ').filter(e => e).filter(e => !stopwords.words.includes(e));
            for(let y of glossArr) {
                if(paragraphArr.includes(y)) {
                    x.overlapCount = x.overlapCount ? x.overlapCount+1 : 1;
                }
            }          
        }

        return wordNetData;
    }   
})(module.exports);