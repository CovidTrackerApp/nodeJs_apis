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








// // Check patient : This one is working. 
// app.get("/check_me/:uname", async (req, res) => {
//     try {
        
//         const {uname} = req.params;
//         // let d =  new Date().slice(4, 15);

//         let d =  new Date()
//         // let dd = dateFormat(d, "mm/dd/yyyy");
//         let ddd = new Date(d);
//         let gg = ddd.setDate(ddd.getDate() - 8);
//         gg = new Date(gg)

//         // let dd = dateFormat(gg, "mm/dd/yyyy");
//         // date oper thk hai.
//         let dd = dateFormat(gg, "yyyy/mm/dd");
        
//         console.log(uname);
//         console.log(d);
//         // dd = "05/18/2021"
//         console.log(dd);
        
//         ///////////////////////////////////////////////////////
//         // This is perfect query. 
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
//         // working query2 below
//         const query2 = await client.query("SELECT * FROM beacon_scan INNER JOIN patient_data_2 on patient_data_2.patient_key=beacon_scan.beaconid_others WHERE beacon_scan.uname=$1 AND beacon_scan.date >= $2 AND patient_data_2.result='yes'", [uname, dd]);
//         // const query2 = await client.query("SELECT * FROM beacon_scan INNER JOIN patient_data_2 on beacon_scan.beaconid_others=patient_data_2.patient_key");


//         console.log("This is query 1 result : ",  values);
//         // var result = query2.rows[0].patient_key;
//         console.log("HIIII: ", query2.rows);
//         // res.json(query2.rows);
//         /////////// working logic down
//         // if (query2.rows[0] != null){
//         //     res.json({
//         //             "result": 1,    ///   Interaction found
//         //             "status" : 200
//         //     }); 
//         //     // res.json("Interation found");
//         // }
//         // else {
//         //     // res.json("No interaction found");
//         //     res.json({
//         //             "result": 0,    ///   Interaction Not found
//         //             "status" : 200
//         //         }); 
//         // }
//         /////////////// end here
//         if (query2.rows[0] != null){
//             res.json("Yes");   //  Interaction found
//             // res.json("Interation found");
//         }
//         else {
//             // res.json("No interaction found");
//             res.json("No");  ///   Interaction Not found
//         }
    
//     } catch (error) {
//         console.error(error.message);
//     }
// })
