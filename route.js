const express = require('express');
const connection = require('../db/connection');
const router = express.Router();
const http = require('http');
const { name } = require('ejs');
const mysql = require('mysql');
const url = require('url');
const IP = require('ip');
const session = require('express-session');
const { query } = require('express');
const { error } = require('console');
const fs = require('fs')
const cookieparser = require('cookie-parser');
router.use(cookieparser());
const moment = require('moment');


// SESSION  ======================================
const sess_time = 1000 * 60 * 60 * 24;
router.use(session({
    secret: "SESS_SECRET:'{}'!@#$$#!SESS_SECRET",
    saveUninitialized: true,
    cookie: {
        maxAge: sess_time
        // sameSite: true,
    },
    resave: false
}));

// API for login ==>
router.post('/auth', function (req, res) {
    try {
        let admin_id = req.body.username;
        let admin_password = req.body.user_password;
        connection.query('SELECT * FROM login_master WHERE admin_id = ? AND admin_password = ?', [admin_id, admin_password], function (error, results, fields) {
            if (error) throw error;
            if (results == '' || undefined) {
                res.redirect("notfound")
            }
            else {
                res.redirect('/page');
            }
        });
    }
    catch (error) {
        console.log(error)
        res.send('Error Found');
    }
});



function ref() {
    var minimum = 1

    var maximum = 999
    var number = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    return (number);
}

router.post('/checkbox', (req, res) => {

    var agent_id = req.body.agent_id;
    var agent_name = req.body.agent_name;
    var ref_no = ref()

    // Construct SQL statement to insert selected rows
    var sql = `INSERT INTO testing (name , email,ref_no) VALUES ('${agent_id}','${agent_name}','${ref_no}')`
    // console.log(sql)
    // Execute SQL statement
    connection.query(sql, (err, results) => {
        if (err) throw err;
    })

    res.json({
        agent_id: agent_id,
        agent_name: agent_name
    })
})

router.get('/try', function (req, res) {
    res.render('try')
})

// API for Home Page ==>
router.get('/', async (req, res) => {
    try {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.clearCookie();
            }
            res.render('login.ejs');
        });
    } catch (error) {
        console.log(error)
        res.redirect('/error');
    }
})

//API for Logout Page =====>
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        }
        res.clearCookie(login_session_status);
        res.redirect('login')
    })
})

// REDIRECT LOGIN =======>
const redirectLogin = (req, res, next) => {
    if (!req.session.login_session_status) {
        res.redirect('/');
    }
    else {
        res.redirect('/page')
    }
}


// All GET API for ticketing project
router.get('/notfound', function (req, res) {
    res.render('notfound')
});

router.get('/teamfeed', function (req, res) {
    var sql = `SELECT * FROM agent_master`
    connection.query(sql, function (error, resultr) {
        res.render('teamfeed', { resultr: resultr })
    });
});

router.get('/page', function (req, res) {
    var sql = `SELECT * FROM agent_master`
    connection.query(sql, function (err, result1) {
        console.log(result1)
        res.render('page', { result1: result1 })
    })
})

router.get('/footer', redirectLogin, function (req, res) {
    res.render('footer')
});
router.get('/header', redirectLogin, function (req, res) {
    res.render('header')
});
router.get('/views', function (req, res) {
    res.render('views')
});
router.get('/agent_queue', function (req, res) {
    res.render('agent_queue')
})

router.get('/ticket_page', redirectLogin, function (req, res) {
    res.render('ticket_page')
})
router.get('/knowledge', function (req, res) {
    res.render('knowledge')
})

router.get('/community', redirectLogin, function (req, res) {
    res.render('community')
})

router.get('/analytics', function (req, res) {
    res.render('analytics')
});

router.get('/activities', redirectLogin, function (req, res) {
    res.render('activities')
})
router.get('/close_ticket', function (req, res) {
    res.render('close_ticket')
});


router.get('/tags', function (req, res) {
    res.render('tags')
})
// router.get('/edit', function (req, res) {
//     var sql1 = `SELECT * FROM ticket_master`
//     connection.query(sql1, function (error, resultr) {
//         // console.log(resultr);
//         res.render('edit', { resultr: resultr })
//     })
// })

router.get('/team_queue', function (req, res) {
    res.render('team_queue')
})
// router.get('/chat', function (req, res) {
//     res.render('chat')
// })
router.get('/ticket', function (req, res) {
    res.render('ticket')
})

router.get('/chat_application', function (req, res) {
    res.render('chat_application')
});

// for current date and time =========>
const now = moment();
const formattedDate = now.format('YYYY-MM-DD');
const formattedtime = now.format('HH:mm:ss');
console.log(formattedDate);
console.log(formattedtime);

// API to post data though ajax =======>
router.post('/post', function (req, res) {

    var user_name = req.body.user_name;
    var ticket_id = req.body.ticket_id;
    var agent_id = req.body.agent_id;
    var agent_name = req.body.agent_name;
    var date = formattedDate;
    var time = formattedtime;


    var sql = `INSERT INTO ticket_assign_master (user_name,ticket_id,agent_id,agent_name,c_date,c_time,status)
     VALUES ('${user_name}','${ticket_id}','${agent_id}','${agent_name}','${date}','${time}','Active')`
    console.log(sql)
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(err)
        res.json({
            user_name: user_name,
            ticket_id: ticket_id,
            agent_id: agent_id,
            agent_name: agent_name

        });
    })
})



//  API for append the data in ticket  ==========>
router.get('/ticketing', function (req, res) {
    var sql1 = `SELECT * FROM ticket_master`
    connection.query(sql1, function (error, result) {
        if (error) throw error


        var sql1 = `SELECT * FROM closed_ticket_master`
        connection.query(sql1, function (error, result1) {

            if (error) throw error
            res.json({
                result: result, result1: result1
            });
        })
    });
});


router.get('/data', function (req, res) {
    var sql = `SELECT * FROM visitor`
    connection.query(sql, function (err, result) {
        console.log(sql)
        res.render('page')
    })
})

router.get('/fetch', (req, res) => {
    // fetch data from the database
    con.query('SELECT id FROM visitor', (error, results, fields) => {
        if (error) throw error;

        // send the data to the client
        res.json(results);
    });
});




// API for get data and send in chats ==========>
router.get('/chat/:user_name/:email/:tick/:ip_address', async (req, res) => {

    var ip_address = req.params.ip_address;
    var name = req.params.user_name;
    var emai = req.params.email;
    var ticket = req.params.tick;

    var sq1 = `SELECT * FROM closed_ticket_master WHERE ticket_no='${ticket}'`
    connection.query(sq1, function (error, result1) {


        var sq1 = `SELECT * FROM chats`
        connection.query(sq1, function (error, resulte) {

            res.render('chat', { result1: result1, resulte: resulte });

        })
    })
});



// API to get the customer information =>
router.get('/customers', function (req, res) {
    var sqql = `SELECT * FROM ticket_master`
    connection.query(sqql, function (err, resultr) {
        // console.log(resultr)
        res.render('customers', { resultr: resultr })
    })
})

//   API to get the chat History data  ==>
router.get('/chat', async (req, res) => {
    var sql = `SELECT * FROM chatbot_history`
    connection.query(sql, function (err, result123) {
        console.log(result123)
        res.render('chat')
    });
});

// API to update the bot_response
router.post('/chat', function (req, res) {
    try {
        var bot_res = req.body.bot_res;

        var sql = `UPDATE chats SET bot_res='${bot_res}' Where ref_no='${ref_no}'`
        connection.query(sql, function (err, result) {

            if (err) throw err
            console.log(err)
            res.json({
                success: result,
            })
        })

    }
    catch (error) {
        res.redirect('/error')
    }
});


// API for delete the customer data
router.get('/delete/:name', function (req, res) {
    var name = req.params.name;
    // console.log(user_name);
    var sql = `DELETE FROM ticket_master WHERE name='${name}'`

    connection.query(sql, function (error, result) {
        if (error) {
            console.error(error);
            throw error;
        }

        // console.log(result);
        res.redirect('/customers')
    })
})

// API for delete the user_data
router.get('/delete/:name', function (req, res) {

    var name = req.params.name``
    // console.log(user_name);
    var sql = `DELETE FROM ticket_master WHERE name='${name}'`
    connection.query(sql, function (error, result) {
        if (error) {
            console.error(error)
            throw error
        }
        res.redirect('/teamfeed')
        console.log(result);
    });
});
// API for delete the customer data
router.post('/update/:status', async (req, res) => {

    var ticket_no = req.body.ticket_no;
    var status = req.body.status;

    var sql = `UPDATE ticket_master SET status='${status}' WHERE ticket_no ='${ticket_no}'`
    // console.log(sql)
    connection.query(sql, function (error, result1) {
        console.log(error)
        res.redirect('/customers')
    });
});

// API for fetch the data in close_ticket
router.get('/close_ticket', function (req, res) {
    var sql = `SELECT * FROM ticket_master`
    connection.query(sql, function (err, result) {
        console.log(result)
        res.render()
    })
})





module.exports = router;