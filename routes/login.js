var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

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
const jwtGenerator = require('../utils/jwtGenerator');
var pool = new pg.Pool(config);

router.post(
  '/', async function(req, res) {
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }
        client.query("SELECT * FROM users WHERE username = $1;",
            [req.body.username],
            async function (err, result) {
                done();
                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                } else {
                  if(result.rowCount === 0) {
                    res.sendStatus(401);
                  } else {
                      const validPassword = await bcrypt.compare(password, result.rows[0].password);
                      if(validPassword == true) {
                        const token = jwtGenerator(result.rows[0].user_id);
                        return res.json({
                          token: token, 
                          user_id: result.rows[0].user_id, 
                          username: result.rows[0].username,
                          first_name: result.rows[0].first_name,
                          last_name: result.rows[0].last_name,
                          email: result.rows[0].email,
                          role: result.rows[0].role
                        });
                      } else {
                        return res.sendStatus(401);
                      }
                  }
                }
            });
    });
  }
);

module.exports = router;
