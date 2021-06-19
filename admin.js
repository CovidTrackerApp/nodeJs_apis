const express = require("express");
var dateFormat = require("dateformat");
const crypto = require("crypto");
const client = require("./db");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require('bcrypt');
const sendEmail = require("./send_mail");
const {uuid} = require("uuidv4");



// middle ware
app.use(cors());
app.use(express.json());   // req.body()



// create registeration route:
app.post("/register", async(req, res) => {
    
    try {
        // console.log(req.body);
        const {uname} = req.body;
        const {password} = req.body;
        const {ph_no} = req.body;
        const {email} = req.body;
        const {age} = req.body;
        const {gender} = req.body;
        const {status} = req.body;
        const {u_beaconid} = req.body;
        const {fname} = req.body;

        let errors = [];
        
        if (!uname || !password || !ph_no || !email || !age || !gender) {
            res.status(200).json({
                "msg": "Please fill all the fields", 
                "status" : 301
            });
        }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);

        const pass_hash = bcrypt.hashSync(password, salt);

        // const query2 = await client.query("SELECT * FROM users WHERE uname = $1", [uname], (err, results) => {
        client.query("SELECT * FROM users WHERE uname = $1", [uname], (err, results) => {
            if (err) { 
                throw err;
            }
            console.log(results.rows);

            if (results.rows.length > 0) {
                res.json({
                    "msg": "User is already registered", 
                    "status" : 302
                });
            } 
            else {
                // generate OTP
                function randomNum(min, max) {
                    return Math.floor(Math.random() * (max - min) + min)
                }

                const verificationCode = randomNum(10000, 99999);
                
                // send Verification Code via email. 
                sendEmail(verificationCode, email);    
                
                // token
                uid = uuid();

                // const query = await client.query("INSERT INTO users (uname, password, ph_no, email, age, gender, status, u_beaconid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [uname, pass_hash, ph_no, email, age, gender, status, u_beaconid]);
                client.query("INSERT INTO users (uname, password, ph_no, email, age, gender, status, u_beaconid, otp, fname, token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [uname, pass_hash, ph_no, email, age, gender, status, u_beaconid, verificationCode, fname, uid],
                (err, results) => {
                    if (err) {
                        throw err;
                    }
                    else {
                        res.json({
                            "msg": results.rows[0],
                            "u_beaconid": u_beaconid,
                            "status" : 200
                        });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]
                
                    }
                });
            }
        });

        // const query = await client.query("INSERT INTO users (uname, password, ph_no, email, age, gender, status, u_beaconid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [uname, pass_hash, ph_no, email, age, gender, status, u_beaconid]);
        
        // res.status(200).json({
        //     "msg": query.rows[0],
        //     "u_beaconid": u_beaconid,
        //     "status" : 200
        // });  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]


    } catch (error) {
        console.error(error.message);        
    }
})


app.listen(3000, () => {
    console.log("Server has started on port 3000");
    dbStart();
})




















