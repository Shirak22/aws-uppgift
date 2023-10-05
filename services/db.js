const {DocumentClient} = require('aws-sdk/clients/dynamodb');

const db = new DocumentClient({
    region: 'eu-north-1',
});
module.exports = {db}