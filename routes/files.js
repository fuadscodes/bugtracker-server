var express = require('express');
var router = express.Router();
const { cloudinary } = require('../utils/cloudinary');
const saltRounds = 10;

var config = {
    user: 'ajghubvw',
    database: 'ajghubvw',
    password: 'WkOunhWiLcygFDPG4qslZThQxTGsf5kc',
    host: 'ruby.db.elephantsql.com',
    port: 5432,
    max: 5,
    idleTimeoutMillis: 1000
  };  

var pg = require('pg');
const authorization = require('../middleware/authorization');
var pool = new pg.Pool(config);

router.post('/uploadFile', authorization, async function(req, res) {
    try {
        const fileStr = req.body.data;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'ml_default'
        });
        console.log(uploadedResponse.url);
        res.json({url: uploadedResponse.url});
    } catch (error) {
        console.error(error);
        res.status(400);
    }
 });

 router.post('/addFile', authorization, function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }

        client.query("INSERT INTO files(link, note, uploader, created, ticket) values ($1, $2, $3, $4, $5);",
            [req.body.link, req.body.note, req.body.uploader, "now()", req.body.ticket],
            function (err, result) {
                done();
                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(200);
                }
            });
        });
});

 module.exports = router;