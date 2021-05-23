const express = require("express");
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

const upload = multer({
    storage : storage
});

const storage2 = multer.diskStorage({
    
    destination: function(req, file, cb) {
        cb(null, 'uploads/BT_Data/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }

});

const upload2 = multer({
    storage : storage2
});

const storage3 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/Patient_Data/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload3 = multer({
    storage: storage3
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
        
        const {name} = req.body;
        const {ph_no} = req.body;
        const query = await client.query("INSERT INTO users (name, ph_no) VALUES ($1, $2) RETURNING *", [name, ph_no]);
        
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
app.get("/sensor_data/:sid", async(req, res) => {
    const {sid} = req.params;
    console.log(sid);

    //     query = await client.query("SELECT * FROM sensor_data2 INNER JOIN users on sensor_data2.sid=users.name");
    query = await client.query("SELECT * FROM sensor_data2 INNER JOIN users on sensor_data2.sid=users.name WHERE sensor_data12.sid=$1", [sid]);

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

        const query = await client.query(`COPY patient_data (sid, date, time, deviceid, result) FROM '/home/ubuntu/nodeJs_apis/uploads/Patient_Data/${req.file.originalname}' DELIMITER ',' CSV HEADER;`);

        res.json("Query executed succesfully");
    
    } catch (error) {
        console.error(error.message);
    }
})

// check.
app.get("/check_me/:sid", async (req, res) => {
    try {
        
        const {sid} = req.params;
        let d =  Date().slice(4, 15);

        console.log(sid);
        console.log(d);
        
        //const query = await client.query("SELECT * FROM patient_data, users, sensor_data2 INNER JOIN users on sensor_data2.sid=users.name WHERE sensor_data12.sid=$1", [sid]);
        // SELECT * FROM sensor_data2 INNER JOIN users on sensor_data2.sid=users.name WHERE sensor_data12.sid=$1
        const query = await client.query("SELECT * FROM patient_data INNER JOIN bt_data on patient_data.sid=bt_data.sid WHERE bt_data.sid=$1", [sid]);

        // res.json(query.rows[0]);
        res.json(query.rows);  
    
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




























