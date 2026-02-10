const {
    Client
} = require('elasticsearch')
const config = require("../../config/local.json");

const ELASTICSEARCH_HOST = process.env.ELASTICSEARCH_HOST || config.ELASTICSEARCH_HOST || 'localhost:9200';

const client = new Client({
    host: ELASTICSEARCH_HOST,
    log: 'trace'
})

client.cluster.health({}, (err, resp, status) => {
    if (resp) console.log("-- Client Health -- Green");
});

module.exports = client;