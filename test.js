const bcrypt = require("bcrypt");

const saltRounds = 10;
const myPlaintextPassword = "bibek";
const someOtherPlaintextPassword = "bibek";

bcrypt.genSalt(saltRounds, function (err, salt) {
  bcrypt.hash(myPlaintextPassword, salt, async function (err, hash) {
    let hashed1 = hash;
    console.log(hashed1, "hash1");
    const isequal = await bcrypt.compare(myPlaintextPassword, hashed1);
    console.log(isequal);
  });
});

bcrypt.genSalt(saltRounds, function (err, salt) {
  bcrypt.hash(someOtherPlaintextPassword, salt, function (err, hash) {
    let hashed2 = hash;
    console.log(hashed2, "hash2");
  });
});
