const cors = require('cors');
const AppError = require('./utils/appError');
const express = require('express')
const app = express()
const mysql = require("mysql");
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');

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

// Create a Nodemailer transporter
//Linuotezalia1@ eml psw
const transporter = nodemailer.createTransport({
    // Provide your email configuration details here
    host: 'smtp.office365.com',
    port:587,
    secure: false, // Enable SSL/TLS
    auth: {
    user: 'expressnode6@outlook.com',
    pass: 'Linuotezalia1@',
    },
});

let email = 'expressnode6@outlook.com'

function sendEmail(result, subject) {
    // Define the email options
    const mailOptions = {
      from: 'expressnode6@outlook.com',
      to: email,
      subject: subject,
      text: result,
    };
    
    transporter.verify((err, success) => {
        if (err) console.error(err);
        console.log('Your config is correct');
    });
    
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }

// Set the time zone to EET
const timeZone = 'Europe/Bucharest';

  function executeQueryAndSendEmail() {
    // Get the current time in EET
    let currentTime = moment().tz(timeZone);

    // Get the time one hour before the current time in EET
    let oneHourAgo = moment().tz(timeZone).subtract(1, 'hour');

    let formattedCurrentTime = currentTime.format('YYYY-MM-DD HH:mm:ss');
    let formattedOneHourAgo = oneHourAgo.format('YYYY-MM-DD HH:mm:ss');
    
    pool.getConnection((err, connection) => {
        if (err) throw err
        // let query = `SELECT count(*) as amount FROM ispejimas WHERE data >= DATE_FORMAT('${formattedOneHourAgo}', '%Y-%m-%d %H:%i:%s') AND data <= DATE_FORMAT('${formattedCurrentTime}', '%Y-%m-%d %H:%i:%s')`;
        let query = `SELECT TIME_FORMAT(ispejimas.data, "%H:%i") as laikas, ispejimas.galios_virsyjimas, patalpa.pavadinimas FROM ispejimas 
            INNER JOIN patalpa ON patalpa.id = ispejimas.id_patalpa 
            WHERE ispejimas.data >= DATE_FORMAT('${formattedOneHourAgo}', '%Y-%m-%d %H:%i:%s') 
            AND ispejimas.data <= DATE_FORMAT('${formattedCurrentTime}', '%Y-%m-%d %H:%i:%s')`;

        connection.query(query, (error, results) => {
            if (error) {
                console.log('Error executing query:', error);
                connection.release();
                return;
              }

            // let message = `Amount of warnings during the last hour:\n\n`;
            // const count = results[0].amount;
            const count = results.length
            let message = `Įspėjimų kiekis: ${count}\n\n`;
            // message += `Count: ${count}`

            let subject = `${currentTime.format('YYYY-MM-DD')} patalpų įspėjimai ${currentTime.format('HH:mm')} – ${oneHourAgo.format('HH:mm')} laikotarpiu`;

            if (count > 0) {
                message += 'Patalpa' + ' '.repeat(20) + 'Įspėjimo laikas' + ' '.repeat(4) + 'Viršyta reikšmė\n';

                for (let i = 0; i < count; i++) {
                    message += results[i].pavadinimas + ' '.repeat(27-results[i].pavadinimas.length) + results[i].laikas 
                        + ' '.repeat(19-results[i].laikas.length) + results[i].galios_virsyjimas + '\n';
                  }
            }

            // Send the email with the customized message
            if( count > 0){
                sendEmail(message, subject);
            }
            else{
                console.log(message);
            }
            connection.release() // return the connection to pool
        })
    })
  }

executeQueryAndSendEmail();
setInterval(executeQueryAndSendEmail, 60 * 60 * 1000);


//
//Irasai backend
//

// Get all irasai
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

// app.put('/updateWarning', function(req, res) {

//     pool.getConnection((err, connection) => {
//         if (err) throw err


//         const id = req.query.id

//         connection.query('UPDATE ispejimas SET seen=seen+1 WHERE id = ?', [id], (err, rows) => {
//             connection.release() // return the connection to pool
//             if (!err) {
//                 console.log(`ispejimas has been seen.`)
//             } else {
//                 console.log(err)
//             }

//         })
//     })
// });

app.get('/getAccommodationTimes', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const id = req.query.id
        
        connection.query('SELECT dienos_laikas.*, diena.savaites_diena FROM savaite LEFT JOIN savaites_diena ON savaite.id=savaites_diena.id_savaite LEFT JOIN diena ON diena.id=savaites_diena.id_diena LEFT JOIN dienos_laikas ON dienos_laikas.id_diena=diena.id WHERE savaite.id_patalpa=? AND savaite.active=1', [id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
                res.send(err)
            }

            console.log('data: \n', rows)
        })
    })
});

//Insert one entry to irasas
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

//Get irasai of a single day, that are grouped by hours
app.get('/getHourGraph', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const date = new Date(req.query.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        connection.query('SELECT hour(laikas) as hour, AVG(galia) as power, SUM(sanaudos) as usg FROM irasai INNER JOIN (sensorius INNER JOIN patalpa ON patalpa.id = sensorius.id_patalpa) ON sensorius.id = irasai.id_sensorius WHERE patalpa.id = ? AND year(laikas) = ? AND month(laikas) = ? and day(laikas) = ? GROUP BY hour(laikas) ORDER BY hour ASC',
            [req.query.id, year, month, day], (err, rows) => {
                connection.release() // return the connection to pool

                //console.log('data: \n', rows)
                let myArray = [];
                let listCounter = 0;

                for (let i = 0; i < 24; i++) {
                    if (rows.length > listCounter && rows[listCounter].hour == i) {
                        let myObject = {
                            time: i,
                            power: rows[listCounter].power,
                            usage: rows[listCounter].usg
                        };
                        //console.log(myObject);
                        myArray.push(myObject);
                        listCounter = listCounter + 1;
                    }
                    else {
                        let myObject = {
                            time: i,
                            power: 0,
                            usage: 0
                        };
                        //console.log(myObject);
                        myArray.push(myObject);
                    }
                }
                //console.log('test: \n', myArray)

                if (!err) {
                    res.send(myArray)
                } else {
                    console.log(err)
                }

                //console.log('data: \n', rows)
            })
    })
});

//Get irasai of a single month, that are grouped by days
app.get('/getDayGraph', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const date = new Date(req.query.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        connection.query('SELECT day(laikas) as day, AVG(galia) as power, SUM(sanaudos) as usg FROM irasai INNER JOIN (sensorius INNER JOIN patalpa ON patalpa.id = sensorius.id_patalpa) ON sensorius.id = irasai.id_sensorius WHERE patalpa.id = ? AND year(laikas) = ? AND month(laikas) = ? GROUP BY day(laikas) ORDER BY day ASC',
            [req.query.id, year, month], (err, rows) => {
                connection.release() // return the connection to pool

                let myArray = [];
                let listCounter = 0;

                for (let i = 0; i < new Date(year, month, 0).getDate(); i++) {
                    if (rows.length > listCounter && rows[listCounter].day == i) {
                        let myObject = {
                            time: i,
                            power: rows[listCounter].power,
                            usage: rows[listCounter].usg
                        };
                        //console.log(myObject);
                        myArray.push(myObject);
                        listCounter = listCounter + 1;
                    }
                    else {
                        let myObject = {
                            time: i,
                            power: 0,
                            usage: 0
                        };
                        //console.log(myObject);
                        myArray.push(myObject);
                    }
                }
                //console.log('test: \n', myArray)

                if (!err) {
                    res.send(myArray)
                } else {
                    console.log(err)
                }

                //console.log('data: \n', rows)
            })
    })
});

//Get irasai of a single year, that are grouped by months
app.get('/getMonthGraph', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const date = new Date(req.query.date);
        const year = date.getFullYear();

        connection.query('SELECT month(laikas) as month, AVG(galia) as power, SUM(sanaudos) as usg FROM irasai INNER JOIN (sensorius INNER JOIN patalpa ON patalpa.id = sensorius.id_patalpa) ON sensorius.id = irasai.id_sensorius WHERE patalpa.id = ? AND year(laikas) = ? GROUP BY month(laikas) ORDER BY month ASC',
            [req.query.id, year], (err, rows) => {
                connection.release() // return the connection to pool

                //console.log('data: \n', rows)
                let myArray = [];
                let listCounter = 0;

                for (let i = 1; i <= 12; i++) {
                    if (rows.length > listCounter && rows[listCounter].month == i) {
                        let myObject = {
                            time: i,
                            power: rows[listCounter].power,
                            usage: rows[listCounter].usg
                        };
                        console.log(myObject);
                        myArray.push(myObject);
                        listCounter = listCounter + 1;
                    }
                    else {
                        let myObject = {
                            time: i,
                            power: 0,
                            usage: 0
                        };
                        console.log(myObject);
                        myArray.push(myObject);
                    }
                }
                //console.log('test: \n', myArray)

                if (!err) {
                    res.send(myArray)
                } else {
                    console.log(err)
                }

                //console.log('data: \n', rows)
            })
    })
});


//
//Patalpos backend
//

//Get all patalpos
app.get('/getAllAccommendation', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT *, (select count(*) from ispejimas where patalpa.id = ispejimas.id_patalpa AND seen = 0) AS neperziureti_ispejimai FROM patalpa', (err, rows) => {
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

//Get one entry from patalpa by id
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

//Update one entry from patalpa by id
app.post('/updateAccommendation', (req, res) => {
    console.log(req.params.id)
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }

        const id = req.body.accommondationId;
        const pavadinimas = req.body.pavadinimas;
        const atsakingo_asmens_vardas = req.body.atsakingo_asmens_vardas;
        const atsakingo_asmens_pavarde = req.body.atsakingo_asmens_pavarde;
        const atsakingo_asmens_kontaktas = req.body.atsakingo_asmens_kontaktas;
        const kompiuteriu_kiekis = req.body.kompiuteriu_kiekis;
        const energijos_riba_per_zmogu = req.body.energijos_riba_per_zmogu;
        const min_energija_ispejimui = req.body.min_energija_ispejimui;
        const asmeniniai_prietaisai = req.body.asmeniniai_prietaisai;

        connection.query('UPDATE `patalpa` SET`pavadinimas`= ? ,`atsakingo_asmens_vardas`= ? ,`atsakingo_asmens_pavarde`= ? ,`atsakingo_asmens_kontaktas`= ? ,`kompiuteriu_kiekis`= ? ,`energijos_riba_per_zmogu`= ? ,`min_energija_ispejimui`= ? ,`asmeniniai_prietaisai`= ? WHERE id = ?',
        [pavadinimas, atsakingo_asmens_vardas, atsakingo_asmens_pavarde, atsakingo_asmens_kontaktas, kompiuteriu_kiekis, energijos_riba_per_zmogu, min_energija_ispejimui, asmeniniai_prietaisai, id], (err, rows) => {
            connection.release() // return the connection to pool
            if (err){
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({pavadinimas: pavadinimas})

            console.log('data: \n', rows)
        })
    })
});


//DELETE accommodation entry
app.delete('/accommodations/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('DELETE FROM patalpa WHERE id = ?', [req.params.id], (error, rows) => {
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

//POST prietaisai entry
app.post('/accommodations/:id/devices', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        const room = req.params.id;
        const deviceName = req.body.deviceName;
        const address = req.body.ipAddress;

        connection.query('INSERT INTO prietaisai (id_patalpa, name, ip_address) VALUES(?, ?, ?)', [room, deviceName, address], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({id: results.insertId});
        });
    })
});

//GET room all weeks
app.get('/accommodations/:accommodationId/weeks', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT * FROM savaite WHERE id_patalpa = ?', [req.params.accommodationId], (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.send(rows);
        });
    })
});

//PATCH prietaisai entry
app.patch('/accommodations/:id/devices/:device_id/update', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        const room = req.params.id;
        const deviceName = req.body.deviceName;
        const address = req.body.ipAddress;
        const deviceId = req.params.device_id;

        connection.query(`UPDATE prietaisai SET id_patalpa = ?, name = ?, ip_address = ? WHERE id = ?`, [room, deviceName, address, deviceId], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({id: results.insertId});
        });
    })
});

//DELETE prietaisai entry
app.delete('/devices/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('DELETE FROM prietaisai WHERE id = ?', [req.params.id], (error, rows) => {
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

//Get all prietaisai that belong to patalpa with id
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

//Get one prietaisai by id
app.get('/getDevice/:id', (req, res) => {
    console.log(req.params.id)
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * FROM prietaisai WHERE id = ?',[req.params.id], (err, rows) => {
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

//Get all weeks that belong to patalpa with id
app.get('/getAllWeeks/:id', (req, res) => {
    console.log(req.params.id)
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT savaite.id as id, savaite.active as active, diena.savaites_diena as savaites_diena FROM savaite INNER JOIN (savaites_diena INNER JOIN diena ON savaites_diena.id_diena = diena.id) ON savaite.id = savaites_diena.id_savaite WHERE id_patalpa = ?',[req.params.id], (err, rows) => {
            connection.release() // return the connection to pool

            let myArray = [];
            let weekId = 0;
            let listCounter = -1;
        
            rows.map((row) => {
                if (weekId == row.id) {
                    myArray[listCounter].savaites_diena.push(row.savaites_diena);
                }
                else {
                    weekId = row.id;
                    let myObject = {
                        id: row.id,
                        active: row.active,
                        savaites_diena: [row.savaites_diena]
                    };
                    myArray.push(myObject);
                    listCounter = listCounter + 1; 
                }
            });
            console.log('test: \n', myArray)

            if (!err) {
                res.send(myArray)
            } else {
                console.log(err)
            }

            //console.log('data: \n', rows)
        })
    })
});

//Get schedule that belong to patalpa with id
app.get('/getSchedule/:id', (req, res) => {
    console.log(req.params.id)
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT diena.savaites_diena, uzimtumo_laikas.pradzia, uzimtumo_laikas.pabaiga, uzimtumo_laikas.asmenu_kiekis FROM savaite INNER JOIN savaites_diena ON savaite.id = savaites_diena.id_savaite INNER JOIN diena ON savaites_diena.id_diena = diena.id INNER JOIN dienos_laikas ON diena.id = dienos_laikas.id_diena INNER JOIN uzimtumo_laikas ON dienos_laikas.id_uzimtumo_laikas = uzimtumo_laikas.id WHERE savaite.id_patalpa = ?',[req.params.id], (err, rows) => {
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

//
//Diena backend
//

//Get all diena
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

//Get all dienu laikus
app.get('/getAllDaySchedule', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * FROM dienos_laikas INNER JOIN diena on diena.id = dienos_laikas.id_diena INNER JOIN uzimtumo_laikas ON dienos_laikas.id_uzimtumo_laikas = uzimtumo_laikas.id', (err, rows) => {
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

//Get one entry from diena by id
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

//Insert one entry to diena
app.post('/newDay', function(req, res) {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }

        const savaites_diena = req.body.savaites_diena
        const sav_dienos_nr = req.body.sav_dienos_nr

        connection.query('INSERT INTO diena (savaites_diena, sav_dienos_nr) VALUES(?, ?)', [savaites_diena, sav_dienos_nr], (err, rows) => {
            connection.release()
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({id: rows.insertId});
        });
    })
});

//Update one entry from diena by id
app.post('/updateDay', function(req, res) {

    pool.getConnection((err, connection) => {
        if (err) throw err


        const savaites_diena = req.body.savaites_diena
        const sav_dienos_nr = req.body.dienos_nr
        const id = req.body.id

        console.log(savaites_diena)

        connection.query('UPDATE diena SET savaites_diena = ?, sav_dienos_nr = ? WHERE id = ?', [savaites_diena, sav_dienos_nr, id], (err, rows) => {
            connection.release() // return the connection to pool
            if (err){
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({savaites_diena: savaites_diena})

            console.log('data: \n', rows)

        })

    })
});

//Delete one entry from diena by id
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

//GET all available days
app.get('/availableDays', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT diena.* FROM diena WHERE diena.id NOT IN (SELECT savaites_diena.id_diena FROM savaites_diena)', (error, rows) => {
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

//Add time to the week
app.post('/days/:dayId/addtime', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }

        const day = req.params.dayId;
        const time = req.body.timeId;

        connection.query('INSERT INTO dienos_laikas (id_diena, id_uzimtumo_laikas) VALUES (?, ?)', [day, time], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({id: results.insertId, id_diena: day, id_uzimtumo_laikas: time});
        });
    })
});

//
//Uzimtumo_laikas backend
//

//GET all times
app.get('/times', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT id, TIME_FORMAT(pradzia, "%H:%i") as pradzia, TIME_FORMAT(pabaiga, "%H:%i") as pabaiga, asmenu_kiekis FROM uzimtumo_laikas', (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.send(rows);
        });
    })
});

//GET selected day's times
app.get('/days/:dayId/times', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT uzimtumo_laikas.id, TIME_FORMAT(uzimtumo_laikas.pradzia, "%H:%i") as pradzia, TIME_FORMAT(uzimtumo_laikas.pabaiga, "%H:%i") as pabaiga, asmenu_kiekis FROM uzimtumo_laikas INNER JOIN dienos_laikas ON uzimtumo_laikas.id = dienos_laikas.id_uzimtumo_laikas WHERE dienos_laikas.id_diena = ?', [req.params.dayId], (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.send(rows);
        });
    })
});

//GET all entries from uzimtumo_laikas
app.get('/getAllTime', (req, res) => {
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

//GET one uzimtumo_laikas
app.get('/getTime/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT * FROM uzimtumo_laikas WHERE id = ?', [req.params.id], (error, rows) => {
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

//Insert one entry to uzimtumo_laikas
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
                res.status(201).json({id: rows.insertId});
                //res.redirect('back')
            } else {
                console.log(err)
            }

        })

    })
});

//UPDATE uzimtumo_laikas entry by id
app.put('/updateTime/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        const id = req.params.id;
        const pradzia = req.body.pradzia
        const pabaiga = req.body.pabaiga
        const asmenu_kiekis = req.body.asmenu_kiekis

        connection.query('UPDATE uzimtumo_laikas SET pradzia = ?, pabaiga = ?, asmenu_kiekis = ? WHERE id = ?', [pradzia, pabaiga, asmenu_kiekis, id], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            if (results.changedRows === 0){
              return res.status(404).send('NotFound')
          }
            res.status(200).json({pradzia: pradzia, pabaiga: pabaiga, asmenu_kiekis: asmenu_kiekis})
        })
    })
});

//DELETE uzimtumo_laikas entry by id
app.delete('/deleteTime/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('DELETE FROM savaite WHERE id = ?', [req.params.id], (error, rows) => {
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

//
//Savaite backend
//

//GET all entries from savaite
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

//GET all savaites tvarkarastis
app.get('/getweekSchedule', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT * FROM savaites_diena INNER JOIN diena on diena.id = savaites_diena.id_diena', (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.send(rows);
        });
    })
});

//GET one entry from savaite
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
            res.send(rows[0]);
        });
    })
});

//POST savaite entry
app.post('/weeks', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        const room = req.body.roomId;

        connection.query('INSERT INTO savaite (active, id_patalpa) VALUES(0, ?)', [room], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({id: results.insertId});
        });
    })
});

//UPDATE savaite entry
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
              //return res.status(404).send('NotFound')
          }
            res.status(200).json({weekNumber: weekNumber, isActive: isActive, room: room})
        })
    })
});

// ensure that room has only one active week
app.put('/weeks/:weekId/checkActive', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        // const weekNumber = req.body.weekNumber;
        const weekNumber = req.params.weekId;
        const room = req.body.room;

        connection.query('UPDATE savaite SET active = 0 WHERE id_patalpa = ? AND id != ?', [room, weekNumber], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            if (results.changedRows === 0){
              //return res.status(404).send('NotFound')
          }
            res.status(200).json({weekNumber: weekNumber, room: room})
        })
    })
});

//UPDATE set selected week active
app.put('/weeks/:weekId/setActive', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        // const weekNumber = req.body.weekNumber;
        const weekNumber = req.params.weekId;

        connection.query('UPDATE savaite SET active = 1 WHERE id = ?', [weekNumber], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            if (results.changedRows === 0){
              //return res.status(404).send('NotFound')
          }
            res.status(200).json({weekNumber: weekNumber, isActive: 1})
        })
    })
});

//DELETE savaite entry
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



//GET week days
app.get('/weeks/:weekId/days', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT diena.* FROM savaites_diena LEFT JOIN diena ON savaites_diena.id_diena = diena.id WHERE id_savaite = ?', [req.params.weekId], (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            if (Object.keys(rows).length === 0){
                //return res.status(404).send('NotFound')
            }
            res.send(rows);
        });
    })
});

//Add days to the week
app.post('/weeks/addDay', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        const week = req.body.weekId;
        const day = req.body.dayId;

        connection.query('INSERT INTO savaites_diena (id_savaite, id_diena) VALUES (?, ?)', [week, day], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({id: results.insertId, weekId: week, roomId: day});
        });
    })
});

//DELETE savaite entry
app.delete('/weeks/:weekId/deleteDay', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }

        const weekId = req.params.weekId;
        const dayId = req.body.dayId;

        connection.query('DELETE FROM savaites_diena WHERE id_savaite = ? AND id_diena = ?', [weekId, dayId], (error, rows) => {
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

//DELETE time
app.delete('/times/:timeId', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }

        connection.query('DELETE FROM uzimtumo_laikas WHERE id = ?', [req.params.timeId], (error, rows) => {
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

//DELETE savaites_diena
app.delete('/dayTime/:timeId', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }

        connection.query('DELETE FROM dienos_laikas WHERE id_uzimtumo_laikas = ?', [req.params.timeId], (error, rows) => {
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

//GET all times
app.get('/accommodations/:accommodationId/weeks/:weekId/schedule', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT diena.savaites_diena, savaites_diena.id_diena, dienos_laikas.id_uzimtumo_laikas, TIME_FORMAT(uzimtumo_laikas.pradzia, "%H:%i") AS pradzia, TIME_FORMAT(uzimtumo_laikas.pabaiga, "%H:%i") AS pabaiga, uzimtumo_laikas.asmenu_kiekis FROM savaite LEFT JOIN savaites_diena ON savaite.id = savaites_diena.id_savaite LEFT JOIN diena ON savaites_diena.id_diena = diena.id LEFT JOIN dienos_laikas ON diena.id = dienos_laikas.id_diena LEFT JOIN uzimtumo_laikas ON dienos_laikas.id_uzimtumo_laikas = uzimtumo_laikas.id WHERE savaite.id = ? AND savaite.id_patalpa = ?', [req.params.weekId, req.params.accommodationId], (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.send(rows);
        });
    })
});

//Insert one entry to patalpa
app.post('/newPatalpa', function(req, res) {
    pool.getConnection((err, connection) => {
        if (err) throw err


        const pavadinimas = req.query.pavadinimas
        const atsakingo_asmens_vardas = req.query.atsakingo_asmens_vardas
        const atsakingo_asmens_pavarde = req.query.atsakingo_asmens_pavarde
        const atsakingo_asmens_kontaktas = req.query.atsakingo_asmens_kontaktas
        const kompiuteriu_kiekis = req.query.kompiuteriu_kiekis
        const energijos_riba_per_zmogu = req.query.energijos_riba_per_zmogu
        const min_energija_ispejimui = req.query.min_energija_ispejimui
        const asmeniniai_prietaisai = req.query.asmeniniai_prietaisai


        connection.query('INSERT INTO patalpa(pavadinimas, atsakingo_asmens_vardas,atsakingo_asmens_pavarde, atsakingo_asmens_kontaktas, kompiuteriu_kiekis, energijos_riba_per_zmogu, min_energija_ispejimui, asmeniniai_prietaisai) VALUES(?,?,?,?,?,?,?,?)',
         [pavadinimas, atsakingo_asmens_vardas, atsakingo_asmens_pavarde, atsakingo_asmens_kontaktas, kompiuteriu_kiekis, energijos_riba_per_zmogu, min_energija_ispejimui, asmeniniai_prietaisai], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                console.log(`Patalpa has been added.`)
                res.send(rows)
                // res.redirect('back')
            } else {
                console.log(err)
            }
        })

    })
});

//GET all sensors
app.get('/sensors', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT * FROM sensorius', [req.params.accommodationId], (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.send(rows);
        });
    })
});

//GET selected room sensors
app.get('/accommodations/:accommodationId/sensors', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT * FROM sensorius WHERE id_patalpa = ?', [req.params.accommodationId], (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.send(rows);
        });
    })
});

//POST new sensor
app.post('/accommodations/:accommodationId/sensors', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        const room = req.params.accommodationId;
        const sensorId = req.body.sensorId;

        connection.query('INSERT INTO sensorius (id, id_patalpa) VALUES(?, ?)', [sensorId, room], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({id: results.insertId});
        });
    })
});

// Update accommodation selected sensor
app.put('/accommodations/:accommodationId/sensors/:sensorId', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        const newSensorId = req.body.sensorId;
        const roomId = req.params.accommodationId;
        const sensorId = req.params.sensorId;

        connection.query('UPDATE sensorius SET id = ? WHERE id_patalpa = ? AND id = ?', [newSensorId, roomId, sensorId], (error, results) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            if (results.changedRows === 0){
              //return res.status(404).send('NotFound')
          }
            res.status(200).json({sensorId: sensorId, accommodationId: roomId})
        })
    })
});

//DELETE accommodation selected sensor
app.delete('/accommodations/:accommodationId/sensors/:sensorId', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('DELETE FROM sensorius WHERE id = ? AND id_patalpa = ?', [req.params.sensorId, req.params.accommodationId], (error, rows) => {
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

//GET all ispejimas of acommodation
app.get('/getAllWarnings/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT * FROM ispejimas WHERE id_patalpa = ? AND seen=0', [req.params.id], (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.send(rows);
        });
    })
});

//GET all perziureti ispejimas of acommodation
app.get('/getSeenWarnings/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err){
            return res.status(500).send('Internal Server Error');
        }
        connection.query('SELECT * FROM ispejimas WHERE id_patalpa = ? AND seen=1', [req.params.id], (error, rows) => {
            connection.release();
            if (error){
                return res.status(500).send('Internal Server Error');
            }
            res.send(rows);
        });
    })
});

app.post('/warningSeen', function(req, res) {

    pool.getConnection((err, connection) => {
        if (err) throw err

        const id = req.body.id
        console.log('id: \n', id)

        connection.query('UPDATE ispejimas SET seen = 1 WHERE id = ?', [id], (err, rows) => {
            connection.release() // return the connection to pool
            if (err){
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).json({id: id})

            console.log('data: \n', rows)

        })

    })
});

//GET current used email to send warnings
app.get('/email', (req, res) => {
    res.send(email);
});

// Update email address
app.put('/email', (req, res) => {
    email = req.body.email;
    res.status(200).json({email: email})
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