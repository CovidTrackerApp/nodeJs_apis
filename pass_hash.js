const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'Hello';
const someOtherPlaintextPassword = 'not_bacon';


const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(myPlaintextPassword, salt);


console.log(hash);

const res = bcrypt.compareSync(myPlaintextPassword, hash); // true
console.log(res);

console.log(bcrypt.compareSync(someOtherPlaintextPassword, hash)); // false)