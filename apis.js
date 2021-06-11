const express = require("express");
var dateFormat = require("dateformat");
const crypto = require("crypto");
const client = require("./db");
const cors = require("cors");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/Sensor_Data/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const storage2 = multer.diskStorage({
    
    destination: function(req, file, cb) {
        cb(null, 'uploads/BT_Data/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }

});


const storage3 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/Patient_Data/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

const storage4 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/Beacon_Data/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

const storage5 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/Patient_Data_2/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});


const upload = multer({
    storage : storage
});

const upload2 = multer({
    storage : storage2
});

const upload3 = multer({
    storage: storage3
});

const upload4 = multer({
    storage: storage4
});

const upload5 = multer({
    storage: storage5
});

const app = express();

// middle ware
app.use(cors());
app.use(express.json());   // req.body()


// ROUTES ///

// create 1st route:

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
        
        const query = await client.query("INSERT INTO users (uname, password, ph_no, email, age, gender, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [uname, password, ph_no, email, age, gender, status]);
        
        res.json(query.rows[0]);  // rows[0] mean we dont need all the data in response we just need to read the data that we are inserting in to db just. so we specify row[0]


    } catch (error) {
        console.error(error.message);        
    }
})

// get all the user data

app.get("/users", async(req, res) => {
    try {
        const allUsers = await client.query("SELECT * FROM users");
        res.json(allUsers.rows);

    } catch (error) {
        console.error(error.message);
    }
})

// get a specific user.
app.get("/users/:id", async(req, res) => {
    try {
        console.log(req.params);
        console.log(req.params.id);
        const {id} = req.params;

        const query = await client.query("SELECT * FROM users WHERE id = $1", [id]);
        
        res.json(query.rows[0]);

    } catch (error) {
        console.error(error.message);
    }
})

// update user.
app.put("/users/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;
        const {ph_no} = req.body;

        const query = await client.query("UPDATE users SET name=$1, ph_no=$2 WHERE id=$3", [name, ph_no, id]);
        
        res.json("Data updated successfully!");

    } catch (error) {
        console.error(error.message);
    }
})

app.delete("/users/:id", async (req, res) => {
    try {
        const {id} = req.params;
        
        const query = await client.query("DELETE FROM users WHERE id=$1", [id]);
        // res.json("Data was deleted.");
        res.json(query.rows);

    } catch (error) {
        console.error(error.message);
    }
})

// upload sensors data. 
app.post("/upload_sensor", upload.single("sensorCsv"), async (req, res) => {
    try {
        console.log(req.file);
        const {name} = req.body;
        // const query = await client.query("COPY sensor_data FROM 'uploads/alifurqan.csv'  DELIMITER ',' CSV HEADER;");
        const query = await client.query(`COPY sensor_data2(sid, date, time, lat, long, altituide, velocity, speed, acceleration) FROM '/home/ubuntu/nodeJs_apis/uploads/Sensor_Data/${req.file.originalname}'  DELIMITER ',' CSV HEADER;`);              
 
        // res.json(query.rows[0]);
        res.json("query.rows[0]");  
    
    } catch (error) {
        console.error(error.message);
    }
})

// get sensor data of specific user. 
app.get("/sensor_data/:uname", async(req, res) => {
    const {uname} = req.params;
    console.log(uname);

    //     query = await client.query("SELECT * FROM sensor_data2 INNER JOIN users on sensor_data2.uname=users.name");
    query = await client.query("SELECT * FROM sensor_data INNER JOIN users on sensor_data.uname=users.uname WHERE sensor_data.uname=$1", [uname]);

    res.json(query.rows);

})

// upload BT data.
app.post("/upload_btdata", upload2.single("btcsv"), async (req, res) => {
    try {
        console.log(req.file);
        const {name} = req.body;
        // const query = await client.query("COPY sensor_data FROM 'uploads/alifurqan.csv'  DELIMITER ',' CSV HEADER;");
        const query = await client.query(`COPY bt_data(sid, date, time, deviceid, rssi, distance) FROM '/home/ubuntu/nodeJs_apis/uploads/BT_Data/${req.file.originalname}'  DELIMITER ',' CSV HEADER;`);              
 
        // res.json(query.rows[0]);
        res.json("query.rows[0]");  
    
    } catch (error) {
        console.error(error.message);
    }
})

// upload patient CSV
app.post("/patient_data", upload3.single("patientcsv"), async (req, res) => {
    try {
        console.log(req.file);
        const {name} = req.body;
        const {sender} = req.body;
        

        const query = await client.query(`COPY patient_data (sid, date, time, deviceid, result) FROM '/home/ubuntu/nodeJs_apis/uploads/Patient_Data/${req.file.originalname}' DELIMITER ',' CSV HEADER;`);

        res.json("Query executed succesfully");
    
    } catch (error) {
        console.error(error.message);
    }
})

// upload beacon_scan data
app.post("/beacon_data", upload4.single("beaconcsv"), async (req, res) => {
    try {
        console.log(req.file);
        // const {name} = req.body;
        // const {sender} = req.body;
        
        const query = await client.query(`COPY beacon_scan (uname, beaconid_others, date, time, distance, u_beaconid) FROM '/home/ubuntu/nodeJs_apis/uploads/Beacon_Data/${req.file.originalname}' DELIMITER ',' CSV HEADER;`);

        res.json("Query executed succesfully");
    
    } catch (error) {
        console.error(error.message);
    }
})

// Delete all beacon data
app.get("/del_beacon_data", async (req, res) => {
    try {
        const query = await client.query("TRUNCATE TABLE beacon_scan");

        res.json("Query executed succesfully");
    
    } catch (error) {
        console.error(error.message);
    }
})

// Hospital uploading data and updating status table too.
app.post("/patient_data_2", upload5.single("patientcsv_2"), async (req, res) => {
    try {
        console.log(req.file);
        const {name} = req.body;
        // const {sender} = req.body;
        
        const query = await client.query(`COPY patient_data_2 (uname, date, time, patient_key, result) FROM '/home/ubuntu/nodeJs_apis/uploads/Patient_Data_2/${req.file.originalname}' DELIMITER ',' CSV HEADER;`);
        // const query2 = await client.query(`COPY user_status (uname, date, time, status) FROM '/home/ubuntu/nodeJs_apis/uploads/Patient_Data_2/${req.file.originalname}' DELIMITER ',' CSV HEADER;`);


        res.json("Query executed succesfully");
    
    } catch (error) {
        console.error(error.message);
    }
})

// Delete patient_data_2
app.get("/del_pat_data", async (req, res) => {
    try {
        const query = await client.query("TRUNCATE TABLE patient_data_2");
        // const query2 = await client.query(`COPY user_status (uname, date, time, status) FROM '/home/ubuntu/nodeJs_apis/uploads/Patient_Data_2/${req.file.originalname}' DELIMITER ',' CSV HEADER;`);

        res.json("Query executed succesfully");
    
    } catch (error) {
        console.error(error.message);
    }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // check covid tracing.
// app.get("/check_me/:sid", async (req, res) => {
//     try {
        
//         const {sid} = req.params;
//         // let d =  new Date().slice(4, 15);

//         let d =  new Date()
//         // let dd = dateFormat(d, "mm/dd/yyyy");
//         let ddd = new Date(d);
//         let gg = ddd.setDate(ddd.getDate() - 7);
//         gg = new Date(gg)

//         let dd = dateFormat(gg, "mm/dd/yyyy");
        
//         console.log(sid);
//         console.log(d);
//         // dd = "05/18/2021"
//         console.log(dd);

        
//         //const query = await client.query("SELECT * FROM patient_data, users, sensor_data2 INNER JOIN users on sensor_data2.sid=users.name WHERE sensor_data12.sid=$1", [sid]);
//         // SELECT * FROM sensor_data2 INNER JOIN users on sensor_data2.sid=users.name WHERE sensor_data12.sid=$1
//         // working. 
//         // const query = await client.query("SELECT * FROM bt_data INNER JOIN patient_data on patient_data.deviceid=bt_data.deviceid WHERE bt_data.sid=$1 AND bt_data.date > $2", [sid, dd]);
//         const query = await client.query("SELECT * FROM bt_data INNER JOIN patient_data on patient_data.deviceid=bt_data.deviceid WHERE bt_data.sid=$1 AND bt_data.date > $2 AND patient_data.result='yes'", [sid, dd]);

//         // res.json("query.rows[0]");
//         res.json(query.rows);  
    
//     } catch (error) {
//         console.error(error.message);
//     }
// })

///////////////////////////////////////////////////////////////////////////////////////////////////////////


// check covid tracing V2.
// app.get("/check_me/:uname", async (req, res) => {
//     try {
        
//         const {uname} = req.params;
//         // let d =  new Date().slice(4, 15);

//         let d =  new Date()
//         // let dd = dateFormat(d, "mm/dd/yyyy");
//         let ddd = new Date(d);
//         let gg = ddd.setDate(ddd.getDate() - 7);
//         gg = new Date(gg)

//         let dd = dateFormat(gg, "mm/dd/yyyy");
        
//         console.log(uname);
//         console.log(d);
//         // dd = "05/18/2021"
//         console.log(dd);
        
//         ///////////////////////////////////////////////////////
//         const query = await client.query("SELECT patient_key FROM patient_data_2 WHERE date=$1", [d])
//         var p_ids = query.rows;
//         var values = new Array();
//         // p_ids.forEach(element => {
//         //     values.push(element.patient_key);
//         // });
//         // console.log(values); 
//         p_ids.forEach(element => {
//             const str = element.patient_key;
//             const secret = "_6iL"
//             const sha256Hasher = crypto.createHmac("sha256", secret);
//             const hash = sha256Hasher.update(str).digest("hex");
//             // console.log(hash); 
//             // const query2 = await client.query("SELECT * FROM beacon_scan INNER JOIN patient_data_2 on $3=beacon_scan.beaconid_others WHERE beacon_scan.uname=$1 AND beacon_scan.date > $2 AND patient_data_2.result='yes'", [uname, dd, hash]);

//             values.push(hash);
//         });
//         const query2 = await client.query("SELECT * FROM beacon_scan INNER JOIN patient_data_2 on $3=beacon_scan.beaconid_others WHERE beacon_scan.uname=$1 AND beacon_scan.date > $2 AND patient_data_2.result='yes'", [uname, dd, values]);

//         console.log(values);
//         res.json(query2.rows); 
//         // res.json(query.rows);
//         // p_ids.forEach(element => {
//         //     // console.log(element.patient_key);
//         //     // const str = "d18483a7937babdc6e65c7848404dcc263c70ad3649d805fd12032abc288e145";
//         //     const str = element.patient_key;
//         //     const secret = "_6iL"
//         //     const sha256Hasher = crypto.createHmac("sha256", secret);
//         //     const hash = sha256Hasher.update(str).digest("hex");
//         //     console.log(hash); 
//         //     // const query2 = await client.query("SELECT * FROM beacon_scan INNER JOIN patient_data_2 on $3=beacon_scan.beaconid_others WHERE beacon_scan.uname=$1 AND beacon_scan.date > $2 AND patient_data_2.result='yes'", [uname, dd, hash]);

//         // });

        
//         //////////////////////////////////////// Generating HASH ///////////////////////////////////////////
        
//         // const str = "d18483a7937babdc6e65c7848404dcc263c70ad3649d805fd12032abc288e145";
//         // // secret or salt to be hashed with
//         // const secret = "_6iL";
//         // // create a sha-256 hasher
//         // const sha256Hasher = crypto.createHmac("sha256", secret);
//         // // hash the string
//         // const hash = sha256Hasher.update(str).digest("hex");
//         // console.log(hash); 


//         ////////////////////////////////////////////////////////////////////////////////
        
//         //const query = await client.query("SELECT * FROM patient_data, users, sensor_data2 INNER JOIN users on sensor_data2.uname=users.name WHERE sensor_data12.uname=$1", [uname]);
//         // SELECT * FROM sensor_data2 INNER JOIN users on sensor_data2.uname=users.name WHERE sensor_data12.uname=$1
//         // working. 
//         // const query = await client.query("SELECT * FROM bt_data INNER JOIN patient_data on patient_data.deviceid=bt_data.deviceid WHERE bt_data.uname=$1 AND bt_data.date > $2", [uname, dd]);
//         // const query = await client.query("SELECT * FROM beacon_scan INNER JOIN patient_data_2 on patient_data.deviceid=bt_data.deviceid WHERE bt_data.uname=$1 AND bt_data.date > $2 AND patient_data.result='yes'", [uname, dd]);
//         // const query = await client.query("SELECT * FROM beacon_scan INNER JOIN patient_data_2 on patient_data_2.patient_key=beacon_scan.beaconid_others WHERE beacon_scan.uname=$1 AND beacon_scan.date > $2 AND patient_data_2.result='yes'", [uname, dd]);

//         // // res.json("query.rows[0]");
//         // res.json(query.rows);  
    
//     } catch (error) {
//         console.error(error.message);
//     }
// })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Check patient V3
app.get("/check_me/:uname", async (req, res) => {
    try {
        
        const {uname} = req.params;
        // let d =  new Date().slice(4, 15);

        let d =  new Date()
        // let dd = dateFormat(d, "mm/dd/yyyy");
        let ddd = new Date(d);
        let gg = ddd.setDate(ddd.getDate() - 8);
        gg = new Date(gg)

        // let dd = dateFormat(gg, "mm/dd/yyyy");
        // date oper thk hai.
        let dd = dateFormat(gg, "yyyy/mm/dd");
        
        console.log(uname);
        console.log(d);
        // dd = "05/18/2021"
        console.log(dd);
        
        ///////////////////////////////////////////////////////
        // This is perfect query. 
        const query = await client.query("SELECT patient_key FROM patient_data_2 WHERE date=$1", [d])
        var p_ids = query.rows;
        var values = new Array();
        // p_ids.forEach(element => {
        //     values.push(element.patient_key);
        // });
        // console.log(values); 
        p_ids.forEach(element => {
            const str = element.patient_key;
            const secret = "_6iL"
            const sha256Hasher = crypto.createHmac("sha256", secret);
            const hash = sha256Hasher.update(str).digest("hex");
            // console.log(hash); 
            // const query2 = await client.query("SELECT * FROM beacon_scan INNER JOIN patient_data_2 on $3=beacon_scan.beaconid_others WHERE beacon_scan.uname=$1 AND beacon_scan.date > $2 AND patient_data_2.result='yes'", [uname, dd, hash]);

            values.push(hash);
        });
        // working query2 below
        // const query2 = await client.query("SELECT * FROM beacon_scan INNER JOIN patient_data_2 on patient_data_2.patient_key=beacon_scan.beaconid_others WHERE beacon_scan.uname=$1 AND beacon_scan.date >= $2 AND patient_data_2.result='yes'", [uname, dd]);
        const query2 = await client.query("SELECT * FROM beacon_scan INNER JOIN patient_data_2 on patient_data_2.patient_key=beacon_scan.beaconid_others");


        console.log("This is query 1 result : ",  values);
        // var result = query2.rows[0].patient_key;
        console.log("HIIII: ", query2.rows);
        // res.json(query2.rows);
        /////////// working logic down
        // if (query2.rows[0] != null){
        //     res.json({
        //             "result": 1,    ///   Interaction found
        //             "status" : 200
        //     }); 
        //     // res.json("Interation found");
        // }
        // else {
        //     // res.json("No interaction found");
        //     res.json({
        //             "result": 0,    ///   Interaction Not found
        //             "status" : 200
        //         }); 
        // }
        /////////////// end here
        if (query2.rows[0] != null){
            res.json("Yes");   //  Interaction found
            // res.json("Interation found");
        }
        else {
            // res.json("No interaction found");
            res.json("No");  ///   Interaction Not found
        }
    
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




























