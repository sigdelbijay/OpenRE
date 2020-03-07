((conceptnet) => {
    'use strict';
    const axios = require('axios');

    const URL = ' http://api.conceptnet.io';
    conceptnet.init = async(edge) => {
        let syn = [];
        let newUrl = `${URL}/query?start=/c/en/${edge}/n&other=/c/en&rel=/r/Synonym`;
        await axios.get(newUrl)
            .then((data) => {
                let data1 = data.data.edges;
                // console.log(data1);

                for(let i=0; i<data1.length; i++) {
                    let synObj = {
                        synWord: data1[i].end.label,
                        source: ['ConceptNet']
                    }
                    syn.push(synObj);
                }
            })
            .catch((err) => console.log("err", err))
        return syn;
    }


})(module.exports);