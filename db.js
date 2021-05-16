const {Client} = require("pg");

const client = new Client({
    user: "ubuntu",
    password: "ubuntu",
    database: "test_db",
    host: "ec2-52-74-221-135.ap-southeast-1.compute.amazonaws.com",
    post: 5432
});

// client.on("connect", () => {
//     console.log("Database connected");
// })

// client.on("end", () => {
//     console.log("Connnected End");
// })

module.exports = client;






















