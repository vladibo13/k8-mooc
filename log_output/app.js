const crypto = require('crypto')

const randomString = crypto.randomUUID(); 

console.log("App started. Random string:", randomString);

setInterval(() => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}: ${randomString}`);
}, 5000);