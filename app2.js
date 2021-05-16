const client = require("./db");
const express = require("express");


async function execute() {
    try { 
        await client.connect();
        console.log("DB connected successfully.");
        await client.query("");


    }
    catch (e) {
        console.error(`The error has occured: ${e}`)
    }
}
