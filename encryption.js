//Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
// const key = crypto.randomBytes(32);
const key = 'vOV_ksdmpNWj6+IqCc7rdx,01lwHzf-3';
const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(text) {
   let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(text) {
   let iv = Buffer.from(text.iv, 'hex');
   let encryptedText = Buffer.from(text.encryptedData, 'hex');
   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
}

// Text send to encrypt function
var hw = encrypt("Welcome to Tutorials Point...")
console.log(hw)
console.log(decrypt(hw))


////////////////////////////////////////////////////////////////////////////////////////
// This  is wokign code. 
// const crypto = require('crypto');

// const algorithm = 'aes-256-ctr';
// const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
// const iv = crypto.randomBytes(16);

// const encrypt = (text) => {

//     const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

//     const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

//     return {
//         iv: iv.toString('hex'),
//         encryptedData: encrypted.toString('hex')
//     };
// };

// const decrypt = (hash) => {

//     const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

//     const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

//     return decrpyted.toString();
// };

// var hw = encrypt("Welcome to Tutorials Point...")
// console.log(hw)
///////////////////////////////////////////////////////////////////////////////////////////







