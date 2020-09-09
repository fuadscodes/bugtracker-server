var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const authorization = require('../middleware/authorization');

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
            client.query("SELECT user_id, first_name, last_name, email, username, role FROM users WHERE user_id = $1;",
                [req.user],
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.user = result.rows[0];
                        next();
                    }
                });
        });
    }, userPassword: function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }
            client.query("SELECT * FROM users WHERE user_id = $1;",
                [req.body.user_id],
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        console.info(req.body.user_id);
                        req.params.userPassword = result.rows[0];
                        console.info(req.params.userPassword);
                        next();
                    }
                });
        });
    },
    users: function(req, res, next) {
        try {
            pool.connect(function (err, client, done) {
                if (err) {
                    res.end('{"error" : "Error",' +
                        ' "status" : 500}');
                }
                client.query("SELECT * FROM users ORDER BY username ASC;",
                    function (err, result) {
                        done();
                        if (err) {
                            console.info(err);
                            res.sendStatus(400);
                        } else {
                            req.params.users = result.rows;
                            next();
                        }
                    });
            });
        } catch (err) {
            console.info(err.message);
        }
    },
    roles:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT * FROM role ORDER BY role_name ASC;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.roles = result.rows;
                        next();
                    }
                });
        });
    }, 
    projects:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT * FROM project ORDER BY name ASC;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.projects = result.rows;
                        next();
                    }
                });
        });
    },
    project_user: function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT pu.id, u.username, p.name, u.role  from users u inner join project_user pu on u.user_id = pu.user inner join project p on pu.project = p.id ORDER BY u.username ASC;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.project_user = result.rows;
                        next();
                    }
                });
        });
    },
    developers:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT user_id, username FROM users WHERE role = 3 ORDER BY username ASC;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.developers = result.rows;
                        next();
                    }
                });
        });
    },
    priorities:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT * FROM priority;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.priorities = result.rows;
                        next();
                    }
                });
        });
    },
    types:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT * FROM type;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.types = result.rows;
                        next();
                    }
                });
        });
    },
    statuses:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT * FROM status;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.statuses = result.rows;
                        next();
                    }
                });
        });
    },
    tickets:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query('SELECT t.id, t.title, s.username as submitter, t.updated, t.description, p.name as project, u.username as developer, t.priority, t.status, t.type, t.created FROM ticket t INNER JOIN users u on u.user_id = t.developer INNER JOIN project p on p.id = t.project INNER JOIN users s on s.user_id = t.submitter Inner Join project_user pu on p.id = pu.project WHERE pu."user" = $1;',
                [req.body.user],
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.tickets = result.rows;
                        next();
                    }
                });
        });
    },
    chart_roles:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT r.role_name, count(*) as number FROM users u inner join role r on u.role = r.role_id group by r.role_name order by number;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.chart_roles = result.rows;
                        next();
                    }
                });
        });
    },
    chart_types:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT t.name, count(*) as number from ticket ti inner join type t on ti.type = t.id group by t.name order by number;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.chart_types = result.rows;
                        next();
                    }
                });
        });
    },
    chart_priority:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT p.name, count(*) as number from ticket ti inner join priority p on p.id = ti.priority group by p.name order by number;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.chart_priority = result.rows;
                        next();
                    }
                });
        });
    },
    chart_status:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT s.name, count(*) as number from ticket ti inner join status s on s.id = ti.status group by s.name order by number;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.chart_status = result.rows;
                        next();
                    }
                });
        });
    },
    files:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT f.id, f.link, f.note, f.ticket, f.created, u.username as uploader FROM files f INNER JOIN users u on u.user_id = f.uploader;",
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.files = result.rows;
                        next();
                    }
                });
        });
    },
}

router.post('/', authorization, functions.user,
    async (req, res) => {
        try {
            res.json(req.params.user);

        } catch (err) {
            console.error(err.message);
            res.status(500).json("Server error...");
        }
    },
);

router.post(
    '/changePassword', authorization, functions.userPassword,
     async function(req, res) {
      var currentPassword = req.body.currentPassword;
      var newPassword = req.body.newPassword;
      var retypedPassword = req.body.newPassword;

      const validPassword = await bcrypt.compare(currentPassword, req.params.userPassword.password);

      if(validPassword) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }
            bcrypt.hash(newPassword, 10, function(err, hash) {
                client.query("UPDATE users SET password = $1 WHERE user_id = $2;",
                    [hash, req.body.user_id],
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
      } else {
        return res.sendStatus(401);
      }
    }
  );

  router.post(
    '/projects', authorization, function(req, res) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }
            client.query('SELECT p.id, p.name, p.description FROM project p INNER JOIN project_user pu on p.id = pu.project WHERE pu."user" = $1;',
                [req.body.user],
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        let projects = result.rows;
                        return res.json({
                            projects: projects
                        });
                    }
                });
        });
    }
);

router.post(
    '/ticket', authorization, functions.users, functions.tickets, functions.statuses, functions.projects, functions.project_user, functions.developers, functions.priorities, functions.types, function(req, res, next) {
            return res.json({
                roles: req.params.roles,
                users: req.params.users,
                projects: req.params.projects,
                project_user: req.params.project_user,
                developers: req.params.developers,
                priorities: req.params.priorities,
                types: req.params.types,
                tickets: req.params.tickets,
                statuses: req.params.statuses,
            });
        }
);

  
module.exports = router;