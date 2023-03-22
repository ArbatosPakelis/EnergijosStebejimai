const cors = require('cors');
const AppError = require('./utils/appError');
const express = require('express')
const app = express()
const mysql = require("mysql");

const pool = mysql.createPool({
    // connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pvpdb'
})

// app.get("/api", (req, res) => {
//     res.json({"users":["userOne", "userTwo", "userThree"]})
// })

// app.listen(5000, () =>{console.log("Server started on port 5000")})

// app.use('/api/arduin', arduinRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(
    cors()
);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header('Origin'));
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.get('/getAll', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * FROM irasai', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('data: \n', rows)
        })
    })
});

// SELECT sensor_id, hour(reading_time), AVG(power) FROM `sensordata` WHERE sensor_id = 1 GROUP BY hour(reading_time)

app.get('/getAllAccommendation', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * FROM patalpa', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('data: \n', rows)
        })
    })
});

app.get('/getAccommendation/:id', (req, res) => {
    console.log(req.params.id)
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * FROM patalpa WHERE id = ?',[req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('data: \n', rows)
        })
    })
});

app.get('/getAllDevices/:id', (req, res) => {
    console.log(req.params.id)
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * FROM prietaisai WHERE id_patalpa = ?',[req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('data: \n', rows)
        })
    })
});

app.get('/getHourGraph', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT hour(laikas) as hour, AVG(galia) as power FROM `irasai` WHERE id_sensorius = 1 GROUP BY hour(laikas)', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('data: \n', rows)
        })
    })
});

app.get('/getAllDays', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * FROM diena', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('data: \n', rows)
        })
    })
});

app.get('/getDay/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * FROM diena WHERE id = ?',[req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            console.log('data: \n', rows)
        })
    })
});

app.post('/newDay', function(req, res) {

    pool.getConnection((err, connection) => {
        if (err) throw err


        const savaites_diena = req.body.savaites_diena

        console.log(savaites_diena)

        connection.query('INSERT INTO diena SET savaites_diena = ?', savaites_diena, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                console.log(`Day has been added.`)
                res.redirect('back')
            } else {
                console.log(err)
            }

        })

    })
});

app.post('/updateDay', function(req, res) {

    pool.getConnection((err, connection) => {
        if (err) throw err


        const savaites_diena = req.body.savaites_diena
        const id = req.body.id

        console.log(savaites_diena)

        connection.query('UPDATE diena SET savaites_diena = ? WHERE id = ?', [savaites_diena, id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                console.log(`Day has been added.`)
                res.redirect('back')
            } else {
                console.log(err)
            }

        })

    })
});

app.get('/deleteDay/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('DELETE FROM diena WHERE id = ?',[req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send("deleted")
            } else {
                console.log(err)
            }

            console.log('data: \n', rows)
        })
    })
});

app.post('/newSensorEntry', function(req, res) {

    pool.getConnection((err, connection) => {
        if (err) throw err


        const sensor_id = req.body.sensor_id
        const power = req.body.power
        const useage = req.body.useage

        connection.query('INSERT INTO irasai SET id_sensorius = ?, galia = ?, sanaudos = ?', [sensor_id, power, useage], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                console.log(`Entry has been added.`)
                res.redirect('back')
            } else {
                console.log(err)
            }

        })
    })
});


app.post('/newTime', function(req, res) {

    console.log(req.body)

    pool.getConnection((err, connection) => {
        if (err) throw err


        const pradzia = req.body.pradzia
        const pabaiga = req.body.pabaiga
        const asmenu_kiekis = req.body.asmenu_kiekis


        connection.query('INSERT INTO uzimtumo_laikas SET pradzia = ?, pabaiga = ?, asmenu_kiekis = ? ', [pradzia, pabaiga, asmenu_kiekis], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                console.log(`Time has been added.`)
                res.redirect('back')
            } else {
                console.log(err)
            }

        })

    })
});

//GET all weeks
app.get('/weeks', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT * FROM savaite', (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.send(rows);
        });
    })
});

//GET one week
app.get('/weeks/:weekId', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT * FROM savaite WHERE id = ?', [req.params.weekId], (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            if (Object.keys(rows).length === 0){
                return res.status(404).send('NotFound')
            }
            res.send(rows);
        });
    })
});

//POST week
app.post('/weeks', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        const weekNumber = req.body.weekNumber;
        const isActive = req.body.isActive;
        const room = req.body.room;

        connection.query('INSERT INTO savaite SET id = ?, active = ?, id_patalpa = ?', [weekNumber, isActive, room], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({weekNumber: weekNumber, isActive: isActive, room: room})
        });
    })
});

//UPDATE week
app.put('/weeks/:weekId', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        // const weekNumber = req.body.weekNumber;
        const weekNumber = req.params.weekId;
        const isActive = req.body.isActive;
        const room = req.body.room;

        connection.query('UPDATE savaite SET active = ?, id_patalpa = ? WHERE id = ?', [isActive, room, weekNumber], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            if (results.changedRows === 0){
              return res.status(404).send('NotFound')
          }
            res.status(200).json({weekNumber: weekNumber, isActive: isActive, room: room})
        })
    })
});

//DELETE week
app.delete('/weeks/:weekId', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('DELETE FROM savaite WHERE id = ?', [req.params.weekId], (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            if (rows.affectedRows === 0){
                return res.status(404).send('NotFound')
            }
            res.status(204).end();
        });
    })
});



// app.get('/test', (req, res) => {
//     observationsControler.getAllObservations,
//     res.send('json')
// });
app.listen(5000, () => { console.log("Server started on port 5000") })



// app.use('*', (req, res, next) => {
//   next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
// });
// app.use(globalErrorHandler);

module.exports = app;