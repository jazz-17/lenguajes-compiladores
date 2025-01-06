import Scanner from "./src/classes/scanner.js";
import Parser from "./src/classes/parser.js";

// test cases
const testCases = [
  `
  entero a,b;
  real c;
  si(a < b)
    c = a + b;
  fin_si`,
  
  `
  entero _test = 2*11+abc-1/100/a*1;`,

  `
  entero a21=15*2, _s=2/2;`,


  `
  mientras(a < b)
    c = a + b;
    si(b && 2)
      real d = 2.5 + 4.12 * 1;
    fin_si
    entero e = 2;
  fin_mientras`,
  `
  mientras(a < b)
    mientras(c > d)
      mientras( 1 || null)
        real d = 2.5 + 4.12 * 1;
        si(2 && 3)
          entero e = 2;
        fin_si
      fin_mientras
    fin_mientras
  fin_mientras
  real d = 2.5 + 4.12 * 1;
  `,
];

let scanner = new Scanner();
let parser = new Parser(scanner);
testCases.forEach((testCase, i) => {
  scanner.content = testCase;
  let result = parser.parse();
  console.log(result ? `Test case ${i + 1}: ${result}` : parser.message);
});
