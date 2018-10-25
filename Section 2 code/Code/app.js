const {
  login,
  signup
} = require('./services');
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Missing arguments. e.g. node app login|signup [username] [password] [name (when signup)]");
} else {
  switch (args[0]) {
    case 'login':
      if (args[1] && args[2]) {
        login(args[1], args[2]);
      } else {
        console.log("Missing arguments. e.g. node app login [username] [password]");
      }
      break;
    case 'signup':
      if (args[1] && args[2] && args[3]) {
        signup(args[1], args[2], args[3]);
      } else {
        console.log("Missing arguments. e.g. node signup [username] [password] [name in single quotes]");
      }
  }
}