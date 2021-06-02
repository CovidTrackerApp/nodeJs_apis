////  How to create a SHA-256 hash in Node.js?  ////

// To create a SHA-256 hash, you need to import or require the crypto module and use the createHmac() method in Node.js.

// get crypto module
const crypto = require("crypto");

// string to be hashed
const str = "This is furqan ali";
// const str = crypto.randomBytes(4);

// secret or salt to be hashed with
const secret = "_6iL";

// create a sha-256 hasher
const sha256Hasher = crypto.createHmac("sha256", secret);

// hash the string
const hash = sha256Hasher.update(str).digest("hex");

// A unique sha256 hash 😃
console.log(hash); // d22101d5d402ab181a66b71bb950ff2892f6d2a1e436d61c4fb1011e9c49a77a
let bb = Buffer.from(secret);
console.log("This is salt in bytes: ", bb); 
// for(var ll in bb){
//     console.log(ll);    
// }

// const buf = crypto.randomBytes(4);

// console.log(buf);
// console.log(Buffer.from(hash));



///////////////// Encryption ////////////////////////

const algorithm = 'aes-256-cbc'; //Using AES encryption
// const key = crypto.randomBytes(32);
const key = 'vOV_ksdmpNWj6+IqCc7rdx,01lwHzf-3';
// const key = '61f4X0FjLs4pywEt1CiW4w==:BzrFyaL/aXrZD129ujRxaLcQdTtav+gMDpo84Lz2k6U=';
const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { 
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex')
        // bytes: Buffer.byteLength(encryptedData, 'utf8')
     };
 }
 
 var hw = encrypt(hash)
 let gg = hw.encryptedData
console.log(hw)

bb = Buffer.byteLength(gg, 'utf8')
console.log("Total string length in bytes: ", bb)


































