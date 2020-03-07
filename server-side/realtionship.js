((relation) => {
    'use strict';

    const fs = require('fs');
    const http = require('http');
    const request = require('request');
    let contents, arr, arr1, syn;
    relation.init = (app) => {

        // const conceptnetFn = () => {
        //     const keyword = 'snow';
        //     http.get('http://api.conceptnet.io/c/en/' + keyword, (resp) => {
        //         return resp;
        //         // let data = '';
            
        //         // // A chunk of data has been recieved.
        //         // resp.on('data', (chunk) => {
        //         // data += chunk;
        //         // });
            
        //         // // The whole response has been received. Print out the result.
        //         // resp.on('end', () => {
        //         //     return JSON.parse(data);
        //         // });
        
        //     // }).on("error", (err) => {
        //     //     console.log("Error: " + err.message);
        //     });
        // }
        // const conceptnetReturn = await conceptnetFn();
        // console.log("cons", conceptnetReturn);
        // for(let i=0; i<conceptnetReturn.edges.length; i++) {
        //     syn.push(conceptnetReturn.edges[i].end.lebel);
        // }
        // console.log(conceptnetFn);


        
        // contents = fs.readFileSync('./sample.json', 'utf8');
        
        // arr = contents;
        // arr1 = contents.data.map(unit => unit.paragraphs);
        // for(let i=0; i<contents.data.length; i++) {
        //     console.log(contents.data[i]);
        // }
        // console.log("contents", arr);
        let message = '';
        let keyword = 'snow';
        let options = {
            url: 'http://api.conceptnet.io/c/en/' + keyword,
            headers: {
                'User-Agent': 'request'
            }
        };
        let promise1, promise2, promise3,data1;

        promise1 = new Promise((resolve, reject) => {
            request.get(options, function(err, resp, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            })
        })

        promise2 = new Promise((resolve, reject) => {
            setTimeout(() => {
                message += " first";
                resolve(message);
            }, 2000)
        })

        // var printResult = (results) => {console.log("Results = ", results, "message = ", message)}

        function main() {
            // See the order of promises. Final result will be according to it
            Promise.all([promise1]).then((data) => {
                console.log('-------------------------------------------');
                data1 = JSON.parse(data).edges;
                let arr1 = [];
                for(let i=0; i<data1.length; i++) {
                    arr1.push(data1[i].surfaceText);
                }
                app.locals.db.collection('Relation', function (err, collection) {
        
                    collection.insert({ id: 1, relation: arr1});
                    
                });


                // console.log("data2", arr1);
            });
        }

        main();
    };

})(module.exports);
