let express = require('express');
let app = express();

const fetch = require('node-fetch');
const aptos = require('aptos');
let bodyParser = require('body-parser');
let urlEncodedParser = bodyParser.urlencoded({ extended: false});
const client = new aptos.AptosClient("https://fullnode.random.aptoslabs.com");
const a1 = {
    address: "0x1eeeda849696ed6815698f1c9694c730fa338a992def90d4b89963f4994df0d4",
    publicKeyHex: "0x76b006eb383612166b354a5a8b4979c13a805ea33cc86ae7d4a97faba5c38eee",
    privateKeyHex: "0x483d477dc59a47412f6a34b2d9efd98049a6444132663d66a14ec0b063972d7f",
  };
const account1 = aptos.AptosAccount.fromAptosAccountObject(a1);
const payload = {
          
    function: "0x1eeeda849696ed6815698f1c9694c730fa338a992def90d4b89963f4994df0d4::geotagrandnft::get_geolocation",
  type_arguments:[],
    arguments: [],
};

app.get('/genrandloc', async (req, res) =>{

    const eventHandle = await client.view(payload)
    res.send(JSON.stringify(eventHandle[0]))
})

app.get('/mint',urlEncodedParser, async (req, res) => {
    
    const payloadmint = {
        type: "entry_function_payload",
        function: "0x1eeeda849696ed6815698f1c9694c730fa338a992def90d4b89963f4994df0d4::geotagrandnft::mint_geo_token",
        type_arguments: [],
        arguments: [],
    };

    const txnRequest = await client.generateTransaction(account1.address(), payloadmint);
    const signedTxn = await client.signTransaction(account1, txnRequest);
    //console.log(signedTxn);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
    console.log(transactionRes)
    res.send("Coin Mint!" +transactionRes.hash.toString());
    // res.end(JSON.stringify(transactionRes));
})




var server = app.listen(8080, function () {
    var port = server.address().port

    console.log("Example app listening at http://localhost:%s", port);
})