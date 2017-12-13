/**

███████╗███████╗ █████╗ ███╗   ██╗    ███████╗██╗     ██╗     ██╗███████╗
██╔════╝██╔════╝██╔══██╗████╗  ██║    ██╔════╝██║     ██║     ██║██╔════╝
███████╗█████╗  ███████║██╔██╗ ██║    █████╗  ██║     ██║     ██║███████╗
╚════██║██╔══╝  ██╔══██║██║╚██╗██║    ██╔══╝  ██║     ██║     ██║╚════██║
███████║███████╗██║  ██║██║ ╚████║    ███████╗███████╗███████╗██║███████║
╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚══════╝╚══════╝╚══════╝╚═╝╚══════╝

**/
const readline = require('readline');
const fs = require('fs');
const args = process.argv.slice(2);
const weaks = setUpWeakArray();
function setUpWeakArray() {
  try {
    return fs.readFileSync(args[0], 'utf8').split('\n');
  } catch (e) {
    console.log('no weak password list given.');
    return [];
  }
}

/**
 * For each incoming password read out of STDIN
 * call the check password function
 */
const inc = readline.createInterface({
 input: process.stdin,
 output: process.stdout,
 terminal: false
});
inc.on('line', password => checkPassword(password));

/**
 * Begin each validation check with increasing performance hits
 * to encourage early failure. Each validator will follow the shape
 * of a function that returns and object with
 * pass { boolean } and error { string } properties
 */
function checkPassword(password) {
  const validators = [
    isLongEnough,
    isShortEnough,
    isValidCharacters,
    isStrong
  ];
  validators.forEach(fn => {
    var res = fn.call(this, password);
    if (!res.pass) console.error(res.error);
  });
}

/**
 * Check for minimum bound length of password
 */
function isLongEnough(password) {
  const pass = password.length >= 8;
  const error = `Password must be at least 8 characters. ${password} is ${password.length}`;
  return { pass, error };
}

/**
 * Check for minimum bound length of password
 */
function isShortEnough(password) {
  const pass = password.length <= 64;
  const error = `Password must be no more than 64 characters. ${password} is ${password.length}`;
  return { pass, error };
}

/**
 * Check for non ACII characters
 */
function isValidCharacters(password) {
  const pass = !/[^\x00-\x7F]/ig.test(password);
  var badChar = null;
  if (!pass) {
    badChar = password.match(/[^\x00-\x7F]/ig);
  }
  const error = `Password contains an invalid character: ${badChar}`;
  return { pass, error };
}

/**
 * Check that the password isn't in the list of weak passwords
 */
function isStrong(password) {
  const pass = !weaks.includes(password);
  const error = `${password} is too common. Try making the password more unique`;
  return { pass, error };
}
