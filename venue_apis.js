const express = require("express");
var dateFormat = require("dateformat");
const crypto = require("crypto");
const client = require("./db");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require('bcrypt');
const sendEmail = require("./send_mail");
// const {uuid} = require("uuidv4");


const storage4 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/Venue_Beacon_Data/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload4 = multer({
    storage: storage4
});


const app = express();

// middle ware
app.use(cors());
app.use(express.json());   // req.body()


// ROUTES ///
// // create registeration route:
// app.post("/register_venue", async(req, res) => {
    
//     try {
//         const {ven_f_name} = req.body;
//         const {ven_id} = req.body;
//         const {password} = req.body;
//         const {ven_beacon} = req.body;
//         const {pname} = req.body;
//         const {email} = req.body;
//         const {ph_no} = req.body;
//         const {lat} = req.body;
//         const {long} = req.body;

    
//         if (!ven_f_name || !ven_id || !password || ven_beacon || pname || !ph_no || !email) {
//             res.status(200).json({
//                 "msg": "Please fill all the fields", 
//                 "status" : 301
//             });
//         }

//         const saltRounds = 10;
//         const salt = bcrypt.genSaltSync(saltRounds);

//         const pass_hash = bcrypt.hashSync(password, salt);

//         // const query2 = await client.query("SELECT * FROM users WHERE uname = $1", [uname], (err, results) => {
//         client.query("SELECT * FROM venue_registeration WHERE ven_id = $1", [ven_id], (err, results) => {
//             if (err) { 
//                 throw err;
//             }
//             console.log(results.rows);

//             if (results.rows.length > 0) {
//                 res.json({
//                     "msg": "Venue is already registered", 
//                     "status" : 302
//                 });
//             } 
//             else {
//                 // // check duplicacy of email 
//                 client.query(`SELECT * FROM venue_registeration
//                     WHERE email = $1`,
//                     [email], (err, result2) => {
//                     if (err) {
//                         console.log(err);
//                     }
//                     if (result2.rows.length > 0) {
//                         res.json({
//                             "msg": "Email is already registered",
//                             "status" : 303
//                         });
//                     }
//                     else {
//                         // check duplicacy of ph_no
//                         client.query(`SELECT * FROM users
//                         WHERE ph_no = $1`,
//                         [ph_no], (err, result3) => {
//                         if (err) {
//                             console.log(err);
//                         }
//                         if (result3.rows.length > 0) {
//                             res.json({
//                                 "msg": "Phone number is already registered",
//                                 "status" : 304
//                             });
//                         }
//                         else {
//                             // generate OTP
//                             function randomNum(min, max) {
//                                 return Math.floor(Math.random() * (max - min) + min)
//                             }

//                             const verificationCode = randomNum(10000, 99999);
                            
//                             // send Verification Code via email. 
//                             sendEmail(verificationCode, email);    
                            
//                             // token
//                             // uid = uuid();

//                             // const query = await client.query("INSERT INTO users (uname, password, ph_no, email, age, gender, status, u_beaconid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [uname, pass_hash, ph_no, email, age, gender, status, u_beaconid]);
//                             client.query("INSERT INTO users (uname, password, ph_no, email, age, gender, u_beaconid, otp, fname) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [uname, pass_hash, ph_no, email, age, gender, u_beaconid, verificationCode, fname],
//                             (err, results) => {
//                                 if (err) {
//                                     throw err;
//                                 }
//                                 else {
//                                     // client.query("INSERT INTO user_status (uname, date, time, status, hospital_uid) VALUES ($1, $2, $3, $4, $5)", [uname, c_date, time, status, hospital_uid],
//                                     client.query("INSERT INTO user_status (uname, date, time, patient_beacon, hospital_uid, status) VALUES ($1, $2, $3, $4, $5, $6)", [uname, c_date, time, u_beaconid, hospital_uid, status],
//                                     (err, results) => {
//                                         if (err) {
//                                             throw err;
//                                         }
//                                         else{
//                                             res.json({
//                                                 "msg": results.rows[0],
//                                                 "u_beaconid": u_beaconid,
//                                                 "status" : 200
//                                             });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]
//                                         }       
//                                     });
//                                 }
//                             });
                        
//                         }
//                     });
//                 }
//             });

//         }
//         });

//         // const query = await client.query("INSERT INTO users (uname, password, ph_no, email, age, gender, status, u_beaconid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [uname, pass_hash, ph_no, email, age, gender, status, u_beaconid]);
        
//         // res.status(200).json({
//         //     "msg": query.rows[0],
//         //     "u_beaconid": u_beaconid,
//         //     "status" : 200
//         // });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]


//     } catch (error) {
//         console.error(error.message);        
//     }
// })


// // create registeration route:
// app.post("/register_venue", async(req, res) => {
    
//     try {
//         const {ven_f_name} = req.body;
//         const {ven_id} = req.body;
//         const {password} = req.body;
//         const {ven_beacon} = req.body;
//         const {pname} = req.body;
//         const {email} = req.body;
//         const {ph_no} = req.body;
//         const {lat} = req.body;
//         const {long} = req.body;

    
//         if (!ven_f_name || !ven_id || !password || !ven_beacon || !pname || !ph_no || !email) {
//             res.json({
//                 "msg": "Please fill all the fields", 
//                 "status" : 301
//             });
//         }

        
//         // const query2 = await client.query("SELECT * FROM users WHERE uname = $1", [uname], (err, results) => {
//         client.query("SELECT * FROM venue_registeration WHERE ven_id = $1", [ven_id], (err, results) => {
//             if (err) { 
//                 throw err;
//             }
//             console.log(results.rows);

//             if (results.rows.length > 0) {
//                 res.json({
//                     "msg": "Venue is already registered", 
//                     "status" : 302
//                 });
//             } 
            
//             else {
//                 // generate OTP
//                 function randomNum(min, max) {
//                     return Math.floor(Math.random() * (max - min) + min)
//                 }

//                 const verificationCode = randomNum(10000, 99999);
                
//                 // generate password hash
//                 const saltRounds = 10;
//                 bcrypt.genSalt(saltRounds, (err, salt) => {
//                     if(err) {
//                         console.error(err.message);
//                     }
//                     bcrypt.hash(password, salt , (err, hash) =>{
//                     if(err) {
//                         console.error(err.message);
//                     }
//                     // pass_hash = hash;
//                     sendEmail(verificationCode, email);    
                
//                     client.query("INSERT INTO venue_registeration (ven_f_name, ven_id, password, ven_beacon, pname, email, ph_no, lat, long, otp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [ven_f_name, ven_id, hash, ven_beacon, pname, email, ph_no, lat, long, verificationCode],
//                     (err, results) => {
//                         if (err) {
//                             throw err;
//                         }
//                         else {
                            
//                             res.json({
//                                 "msg": results.rows[0],
//                                 "status" : 200
//                             });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]
                            
//                         }
//                     });
//                     });
//                 });
//                 // const salt = bcrypt.genSaltSync(saltRounds);

//                 // const pass_hash = bcrypt.hashSync(password, salt);

                
//                 // // send Verification Code via email. 
//                 // sendEmail(verificationCode, email);    
                
//                 // token
//                 // uid = uuid();

//                 // const query = await client.query("INSERT INTO users (uname, password, ph_no, email, age, gender, status, u_beaconid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [uname, pass_hash, ph_no, email, age, gender, status, u_beaconid]);
//                 // client.query("INSERT INTO venue_registeration (ven_f_name, ven_id, password, ven_beacon, pname, email, ph_no, lat, long, otp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [ven_f_name, ven_id, pass_hash, ven_beacon, pname, email, ph_no, lat, long, verificationCode],
//                 // (err, results) => {
//                 //     if (err) {
//                 //         throw err;
//                 //     }
//                 //     else {
                        
//                 //         res.json({
//                 //             "msg": results.rows[0],
//                 //             "status" : 200
//                 //         });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]
                        
//                 //     }
//                 // });
            
//             }
//         });

//     } catch (error) {
//         console.error(error.message);        
//     }
// })

// create registeration route:
app.get("/register_venue/:ven_f_name/:ven_id/:password/:ven_beacon/:pname/:email/:ph_no/:lat/:long", async(req, res) => {
    
    try {
        const {ven_f_name} = req.params;
        const {ven_id} = req.params;
        const {password} = req.params;
        const {ven_beacon} = req.params;
        const {pname} = req.params;
        const {email} = req.params;
        const {ph_no} = req.params;
        const {lat} = req.params;
        const {long} = req.params;

    
        if (!ven_f_name || !ven_id || !password || !ven_beacon || !pname || !ph_no || !email) {
            res.json({
                "msg": "Please fill all the fields", 
                "status" : 301
            });
        }

        
        // const query2 = await client.query("SELECT * FROM users WHERE uname = $1", [uname], (err, results) => {
        client.query("SELECT * FROM venue_registeration WHERE ven_id = $1", [ven_id], (err, results) => {
            if (err) { 
                throw err;
            }
            console.log(results.rows);

            if (results.rows.length > 0) {
                res.json({
                    "msg": "Venue is already registered", 
                    "status" : 302
                });
            } 
            
            else {
                // generate OTP
                function randomNum(min, max) {
                    return Math.floor(Math.random() * (max - min) + min)
                }

                const verificationCode = randomNum(10000, 99999);
                
                // generate password hash
                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, (err, salt) => {
                    if(err) {
                        console.error(err.message);
                    }
                    bcrypt.hash(password, salt , (err, hash) =>{
                    if(err) {
                        console.error(err.message);
                    }
                    // pass_hash = hash;
                    sendEmail(verificationCode, email);    
                
                    client.query("INSERT INTO venue_registeration (ven_f_name, ven_id, password, ven_beacon, pname, email, ph_no, lat, long, otp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *", [ven_f_name, ven_id, hash, ven_beacon, pname, email, ph_no, lat, long, verificationCode],
                    (err, results) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            
                            res.json({
                                "msg": results.rows[0],
                                "status" : 200
                            });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]
                            
                        }
                    });
                    });
                });
            
            }
        });

    } catch (error) {
        console.error(error.message);        
    }
})





// // Login venue system.
// app.post("/login_venue", async(req, res) => {
//     try {

//         const {ven_id} = req.body;
//         const {password} = req.body;

//         if (!ven_id || !password) {
//             res.json({
//                 "msg": "Please fill all the fields", 
//                 "status" : 301
//             });
//         }

//         client.query("SELECT * FROM venue_registeration WHERE ven_id=$1", [ven_id], (err, results) => {
//                 if (err) {
//                     throw err;
//                 }

//                 console.log(results.rows);

//                 if (results.rows.length > 0) {
//                     const user = results.rows[0];
                
//                     bcrypt.compare(password, user.password, (err, isMatch) => {
//                         if (err) {
//                             throw err;
//                         }

//                         if (isMatch) {
                            
//                             // email = user.email;
                            
//                             res.json({
//                                 "msg": "User authenticated", 
//                                 "status" : 200,
//                             });

                    
//                         }
//                         else {
//                             res.json({
//                                 "msg": "Password is not correct", 
//                                 "status" : 302
//                             });
//                         }
//                     });
//                 } else {
//                     res.json({
//                         "msg": "Venue id is not registered", 
//                         "status" : 303
//                     });
//                 }
                
//             });

//     } catch (error) {
//         console.error(error.message);
//     }
// })


// Login venue system.
app.get("/login_venue/:ven_id/:password", async(req, res) => {
    try {

        // const {ven_id} = req.body;
        // const {password} = req.body;
        const {ven_id} = req.params;
        const {password} = req.params;

        if (!ven_id || !password) {
            res.json({
                "msg": "Please fill all the fields", 
                "status" : 301
            });
        }

        client.query("SELECT * FROM venue_registeration WHERE ven_id=$1", [ven_id], (err, results) => {
                if (err) {
                    throw err;
                }

                console.log(results.rows);

                if (results.rows.length > 0) {
                    const user = results.rows[0];
                
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            throw err;
                        }

                        if (isMatch) {
                            
                            // email = user.email;
                            
                            res.json({
                                "msg": "User authenticated", 
                                "status" : 200,
                            });

                    
                        }
                        else {
                            res.json({
                                "msg": "Password is not correct", 
                                "status" : 302
                            });
                        }
                    });
                } else {
                    res.json({
                        "msg": "Venue id is not registered", 
                        "status" : 303
                    });
                }
                
            });

    } catch (error) {
        console.error(error.message);
    }
})




// // verify OTP
// app.post("/verifyVenueOTP", async(req, res) => {
//     try {

//         const {ven_id} = req.body;
//         const {otp} = req.body;

//         if (!ven_id || !otp) {
//             res.json({
//                 "msg": "Please fill all the fields", 
//                 "status" : 301
//             });
//         }
        
//         client.query("SELECT * FROM venue_registeration WHERE ven_id=$1", [ven_id], (err, results) => {
//             if (err) {
//                 throw err;
//             }

//             console.log(results.rows);

//             if (results.rows.length > 0) {
//                 const user = results.rows[0];
//                 db_otp = user.otp;

//                 if (otp == db_otp) {
//                     res.json({
//                         "msg": "OTP verified successfully",
//                         "status" : 200
//                     });
//                 }
//                 else {
//                     res.json({
//                         "msg": "otp didn't match, try again!",
//                         "status" : 303
//                     });
//                 } 
//             }
//             else {
//                 res.json({
//                     "msg": "Venue Id is not registered", 
//                     "status" : 303
//                 });
//             }
            
//         });
//     } catch (error) {
//         console.error(error.message);
//     }
// })

// verify OTP
app.get("/verifyVenueOTP/:ven_id/:otp", async(req, res) => {
    try {

        const {ven_id} = req.params;
        const {otp} = req.params;

        if (!ven_id || !otp) {
            res.json({
                "msg": "Please fill all the fields", 
                "status" : 301
            });
        }
        
        client.query("SELECT * FROM venue_registeration WHERE ven_id=$1", [ven_id], (err, results) => {
            if (err) {
                throw err;
            }

            console.log(results.rows);

            if (results.rows.length > 0) {
                const user = results.rows[0];
                db_otp = user.otp;

                if (otp == db_otp) {
                    res.json({
                        "msg": "OTP verified successfully",
                        "status" : 200
                    });
                }
                else {
                    res.json({
                        "msg": "otp didn't match, try again!",
                        "status" : 303
                    });
                } 
            }
            else {
                res.json({
                    "msg": "Venue Id is not registered", 
                    "status" : 303
                });
            }
            
        });
    } catch (error) {
        console.error(error.message);
    }
})


// upload beacon_scan data
app.post("/ven_beacon_data", upload4.single("ven_beacon_data"), async (req, res) => {
    try {
        console.log(req.file);
        
        const query = await client.query(`COPY venue_beacon_data (ven_id, ven_beacon, beacon_others, date, time, distance) FROM '/home/ubuntu/nodeJs_apis/uploads/Venue_Beacon_Data/${req.file.originalname}' DELIMITER ',' CSV HEADER;`);

        res.json("Query executed succesfully");
    
    } catch (error) {
        console.error(error.message);
    }
})

// database connection here. //
async function dbStart() {
    try { 
        await client.connect();
        console.log("DB connected successfully.");
        // await client.query("");

    }
    catch (e) {
        console.error(`The error has occured: ${e}`)
    }
}
///

app.listen(5000, () => {
    console.log("Server has started on port 5000");
    dbStart();
})
































































