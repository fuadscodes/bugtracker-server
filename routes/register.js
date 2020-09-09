var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwtGenerator = require("../utils/jwtGenerator");


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
var pool = new pg.Pool(config);

var functions = {
    user: function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }
            client.query("SELECT * FROM users WHERE username = $1;",
                [req.body.username],
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.user = result.rows;
                        next();
                    }
                });
        });
    },
    userData: function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }
            client.query("SELECT * FROM users WHERE username = $1;",
                [req.body.username],
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.userData = result.rows;
                        next();
                    }
                });
        });
    },
    register: (req, res, next) => {
        try {
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const email = req.body.email.toLowerCase();
            const username = req.body.username.toLowerCase();
            const password = req.body.password;

              pool.connect(function (err, client, done) {
                if (err) {
                    res.sendStatus(500);
                }
                bcrypt.hash(password, 10, function(err, hash) {
                    client.query("INSERT INTO users(first_name, last_name, username, password, email) values ($1,$2,$3,$4,$5)",
                        [firstName, lastName, username, hash, email],
                        function (err, result) {
                            done();
                            if (err) {
                                console.info(err);
                                req.params.status = 401;
                                next();
                            } else {
                                if (result.rowCount == 1) {
                                    req.params.status = 200;
                                }
                                next();
                            }
                        });
                });
            });
        } catch (error) {
            console.info(error.message);
            return res.status(500).json({ msg: "Server Error..." });
        }
    }
}

router.post(
    '/', functions.register, functions.user, functions.userData, function(req, res, next) {
            if(req.params.status === 401) {
                res.status(401).end();
            } else {
                const token = jwtGenerator(req.params.user[0].user_id);
                const user = {...req.params.userData[0]};
                console.info("User " + user.first_name);
                res.json({ 
                    token: token,
                    user_id: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    username: user.username,
                    role: user.role
                });
            }
            
        }
    );

module.exports = router;
