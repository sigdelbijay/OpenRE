((conceptnet) => {
    'use strict';
    const axios = require('axios');
    const URL = ' http://api.conceptnet.io';

    async function findSynonym(edge) {
        let newUrl = `${URL}/query?start=/c/en/${edge}/n&other=/c/en&rel=/r/Synonym`;
        let synonym = [];
        await axios.get(newUrl)
            .then((data) => {
                let data1 = data.data.edges;
                for(let i=0; i<data1.length; i++) {
                    synonym.push(data1[i].end.label);
                }
            })
            .catch((err) => console.log("err", err))

        return synonym;
    }
    
    conceptnet.init = async(entities) => {
        let syn = {};
        for(let edge of entities) {
            let synonym = await findSynonym(edge);
            syn[edge] = synonym
        }
        return syn;
    }


})(module.exports);