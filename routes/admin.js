var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();

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

var functions = {
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
    ticketsOnProject:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT t.id, t.title, s.username as submitter, t.updated, t.description, p.name as project, u.username as developer, t.priority, t.status, t.type, t.created FROM ticket t INNER JOIN users u on u.user_id = t.developer INNER JOIN project p on p.id = t.project INNER JOIN users s on s.user_id = t.submitter WHERE project = $1;",
                [req.params.id],
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.ticketsOnProject = result.rows;
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

            client.query("SELECT t.id, t.title, s.username as submitter, t.updated, t.description, p.name as project, u.username as developer, t.priority, t.status, t.type, t.created FROM ticket t INNER JOIN users u on u.user_id = t.developer INNER JOIN project p on p.id = t.project INNER JOIN users s on s.user_id = t.submitter;",
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
    comments:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT c.id, c.message, c.created, u.username as commenter FROM comment c INNER JOIN users u on u.user_id = c.commenter WHERE ticket = $1;",
                [req.params.id],
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.comments = result.rows;
                        next();
                    }
                });
        });
    },
    history:  function(req, res, next) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT h.id, u.username as username, h.old as old, h.new as new, h.changed FROM history h INNER JOIN users u on u.user_id = h.user WHERE ticket = $1;",
                [req.params.id],
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.params.history = result.rows;
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
};

router.post(
    '/', authorization, functions.users, functions.roles, functions.projects, functions.project_user, function(req, res, next) {
            return res.json({
                roles: req.params.roles,
                users: req.params.users,
                projects: req.params.projects,
                project_user: req.params.project_user,
            });
        }
);

router.post(
    '/projects', authorization, function(req, res) {
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
                        let projects = result.rows;
                        return res.json({
                            projects: projects
                        });
                    }
                });
        });
    }
);

router.post('/addProject', authorization, function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }

        client.query("INSERT INTO project(name, description) values ($1, $2);",
            [req.body.projectName, req.body.projectDescription],
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

router.delete('/deleteProject/:id', authorization, function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }
        client.query("DELETE FROM project " +
            "WHERE id = $1;", [req.params.id],
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

router.post('/editRole', authorization, function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }

        client.query("UPDATE users SET role = $1 WHERE username = $2;",
            [req.body.role, req.body.user],
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

router.delete('/deleteProjectUser/:id', authorization, function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }
        client.query("DELETE FROM project_user " +
            "WHERE id = $1;", [req.params.id],
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

router.post('/addUserToProject', authorization, function(req, res, next) {
    console.info(req.body.user, req.body.project);
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }

        client.query("INSERT INTO project_user VALUES (default, $1, $2);",
            [req.body.user, req.body.project],
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

router.post(
    '/usersAndTicketsOnProject/:id', authorization, functions.ticketsOnProject, function(req, res) {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error",' +
                    ' "status" : 500}');
            }

            client.query("SELECT pu.id, u.username, u.email, u.role FROM users u inner join project_user pu on u.user_id = pu.user WHERE pu.project = $1 ORDER BY u.username ASC;",
                [req.params.id],
                function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        let usersOnProject = result.rows;
                        return res.json({
                            usersOnProject: usersOnProject,
                            ticketsOnProject: req.params.ticketsOnProject
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

router.post('/addTicket', 
    authorization, function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }

        client.query("INSERT INTO ticket (title, description, project, developer, priority, type, submitter, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);",
            [req.body.title, req.body.description, req.body.project, req.body.developer, req.body.priority, req.body.type, req.body.submitter, req.body.status],
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

router.delete('/deleteTicket/:id',
    authorization,
    function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }
        client.query("DELETE FROM ticket " +
            "WHERE id = $1;", [req.params.id],
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

router.post(
    '/ticketDetails/:id',
    authorization,
    functions.comments,
    functions.history,
    functions.statuses,
    functions.files,
    function(req, res, next) {
        return res.json({
            comments: req.params.comments,
            history: req.params.history,
            statuses: req.params.statuses,
            files: req.params.files,
        });
    }
);

router.post('/addComment',
    authorization,
    function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }

        client.query("INSERT INTO comment(commenter, message, ticket) VALUES ($1, $2, $3);",
            [req.body.commenter, req.body.message, req.body.ticket],
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

router.post(
    '/charts',
    authorization, 
    functions.chart_roles,
    functions.chart_types,
    functions.chart_priority,
    functions.chart_status,
    function(req, res) {
        return res.json({
            chart_roles: req.params.chart_roles,
            chart_types: req.params.chart_types,
            chart_priority: req.params.chart_priority,
            chart_status: req.params.chart_status,
        });
    }
);

router.post('/changeStatus', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }

        client.query("UPDATE ticket SET status = $1 WHERE id = $2;",
            [req.body.status, req.body.id],
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

router.post('/addInHistory', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error",' +
                ' "status" : 500}');
        }

        client.query('INSERT INTO history ("user", old, new, ticket, changed) VALUES ($1, $2, $3, $4, now());',
            [req.body.user, req.body.old, req.body.new, req.body.ticket],
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