require('dotenv').config();

const name = process.env.NAME;
const surname = process.env.SURNAME;
const group = process.env.GROUP;
const number = process.env.NUMBER;

console.log(`Имя: ${name}`);
console.log(`Фамилия: ${surname}`);
console.log(`Группа: ${group}`);
console.log(`Номер по списку: ${number}`);