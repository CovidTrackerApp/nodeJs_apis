// const express = require("express");
// const app = express();
const client = require("./db");

// app.use(express.json())  // req.body

// ROUTES //

// app.post("/insert", async(req, res) => {
//     try {
//         // TODO
//         const {name, ph_no} = req.body;
//         const query = await client.query("INSERT INTO users (name, ph_no) VALUES ($1, $2) RETURNING *", [name, ph_no]);

//         res.json(query);
//     } catch (err) {
//         console.error(err.message);
//     }

// })

async function execute() {
    try {
        await client.connect();
        console.log("Connected Successfully."); 
        // const result = await client.query("select * from users");
        // await client.query("insert into users values ('Furqan', 4534534)");
        // await client.query("insert into users values ($1, $2)", ['Hussaun', 886299]);
        // // console.table(result.rows)
        // console.log("Inserted a new row")
        
        // updating the record
        await client.query("update users set name = $1", ['John']);
        console.log("Updated the records.")
        
        }
    catch (e) {
        console.error(`Something wrong happend ${e}`);
    } 
    finally {
        await client.end();
        console.log("Client disconnected successfully.")
    }
}

execute();

// client.connect();

// client.query(`select * from test_db`, (err, result) => {
//     if (!err) {
//         console.log(result.rows);
//     }
//     clsient.end();
// })



// app.listen(5000, () => {
//     console.log("Server is listening on port 5000");
// });



















