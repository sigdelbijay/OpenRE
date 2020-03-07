const wbk = require('wikibase-sdk')({
    instance: 'https://my-wikibase-instan.se',
    sparqlEndpoint: 'https://query.my-wikibase-instan.se/sparql'
  })
const url = wbk.searchEntities('Ingmar Bergman');
