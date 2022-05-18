const fs = require('fs');
const idl = require('../target/idl/maius_payment.json');

fs.writeFileSync('./src/idl.json', JSON.stringify(idl));