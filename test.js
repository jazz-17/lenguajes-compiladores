class Scanner {
  constructor(content) {
    this.content = content;
    this.dataTypes = ["entero", "real"];
    this.controlStructureKeywords = [
      "si",
      "sino", // To do
      "mientras",
      "fin_si",
      "fin_mientras",
    ];
    this.operators = ["+", "-", "*", "/", "%", ">", "<", "=", "!", "&", "|"];
    this.separators = [";", ",", "(", ")"];
    this._index = 0; // current index in the content
    this.currentChar = "";

    this.errors = [];
  }

  set index(i) {
    this._index = i;
    this.currentChar = this.content.charAt(i);
  }
  get index() {
    return this._index;
  }
  scan() {
    this.errors = [];
    if (this.index >= this.content.length) {
      return { value: "$", type: "Fin" }; // end of file
    }

    // Skip whitespaces
    while (/\s/.test(this.currentChar)) {
      this.index++;
      if (this.index >= this.content.length) {
        return { value: "$", type: "Fin" }; // end of file
      }
    }

    // Begin tokenization
    let token = "";

    // String literal --NOT SUPPORTED--
    if (this.currentChar === '"') {
      token += this.currentChar;
      this.index++;
      while (this.currentChar !== '"' && this.index < this.content.length) {
        token += this.currentChar;
        this.index++;
      }
      if (this.currentChar !== '"') {
        this.errors.push({
          message: "Error: Comillas de cierre esperada",
          index: this.index,
        });
        return { value: token, type: "error" };
      }

      token += this.currentChar;
      this.index++;
      // return { value: token, type: "cadena" };
      return { value: token, type: "error, el tipo cadena no es soportado" };
    }
    // Number
    else if (/\d/.test(this.currentChar)) {
      while (/\d/.test(this.currentChar)) {
        token += this.currentChar;
        this.index++;
      }
      if (this.currentChar === ".") {
        token += this.currentChar;
        this.index++;
        while (/\d/.test(this.currentChar)) {
          token += this.currentChar;
          this.index++;
        }
        return { value: token, type: "real" };
      }
      if (/[\w]/.test(this.currentChar)) {
        token += this.currentChar;
        while (/\s/.test(this.currentChar)) {
          token += this.currentChar;
          this.index++;
        }
        this.errors.push({
          message: "Error: Numero inválido",
          index: this.index,
        });
        return { value: token, type: "error" };
      }
      return { value: token, type: "número" };
    }

    // Identifier / control structure keyword / data type
    else if (/[a-zA-Z_]/.test(this.currentChar)) {
      while (/\w/.test(this.currentChar)) {
        token += this.currentChar;
        this.index++;
        if (this.index >= this.content.length) {
          break;
        }
      }

      let type;
      if (this.controlStructureKeywords.includes(token)) {
        type = "palabra clave";
      } else if (this.dataTypes.includes(token)) {
        type = "data type";
      } else {
        type = "identificador";
      }

      return { value: token, type: type };
    }
    // Operator
    else if (this.operators.includes(this.currentChar)) {
      let token = this.currentChar;
      const nextChar = this.content.charAt(this.index + 1);

      // Helper function to handle compound operators
      const handleCompoundOperator = (...operators) => {
        if (operators.includes(nextChar)) {
          token += nextChar;
          this.index++;
        }
      };

      switch (this.currentChar) {
        case "<":
        case ">":
        case "=":
        case "!":
          handleCompoundOperator("=");
          break;
        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
          handleCompoundOperator("=", this.currentChar);
          break;
        case "&":
        case "|":
          handleCompoundOperator(this.currentChar);
          break;
        default:
          break;
      }

      this.index++;
      return { value: token, type: "operador" };
    }
    // Separator
    else if (this.separators.includes(this.currentChar)) {
      token += this.currentChar;
      this.index++;
      return { value: token, type: "separador" };
    }
    // Error
    else {
      token += this.currentChar;
      this.index++;
      this.errors.push({
        message: `Error: caracter no reconocido ${token}`,
        index: this.index,
      });
      return { value: token, type: "error" };
    }
  }
}
class Parser {
  constructor(scanner) {
    this.scanner = scanner;
    this.message = "";
    this.simbolosDir = {
      // Variable Declaration
      D: {
        1: ["data type"],
      },
      D_R: {
        1: [","],
        2: [";"],
      },
      D_Q: {
        1: ["="],
        2: [",", ";"],
      },
      // Expression
      D_E: {
        1: ["identificador", "número", "real"],
      },
      D_X: {
        1: ["+", "-"],
        2: [",", ";"],
      },
      D_T: {
        // Term
        1: ["identificador", "número", "real"],
      },
      D_Y: {
        1: ["*", "/"],
        2: ["+", "-", ",", ";"],
      },
      D_F: {
        // Factor
        1: ["identificador", "número", "real"],
      },

      // variable assignment
      A: {
        1: ["identificador"],
      },
      A_E: {
        1: ["identificador", "número", "real"],
      },
      A_X: {
        1: ["+", "-"],
        2: [";"],
      },
      A_T: {
        // Term
        1: ["identificador", "número", "real"],
      },
      A_Y: {
        1: ["*", "/"],
        2: ["+", "-", ";"],
      },
      A_F: {
        // Factor
        1: ["identificador", "número", "real"],
      },

      // Condition
      C: {
        1: ["identificador", "número", "real"],
      },
      C_X: {
        1: ["&&", "||"],
        2: [")"],
      },
      C_T: {
        // Term
        1: ["identificador", "número", "real"],
      },
      C_Y: {
        1: ["<", ">", "<=", ">=", "==", "!="],
        2: ["&&", "||", ")"],
      },
      C_F: {
        // Factor
        1: ["identificador", "número", "real"],
      },
    };
    this.stack = []; // Used for validating control structures
    this.token;
  }
  parse() {
    this.stack = [];
    this.scanner.index = 0;
    this.token = this.scanner.scan();

    debugger
    while (this.token.type !== "Fin") {
      if (this.token.type === "data type") {
        if (!this.D()) return false;
        this.token = this.scanner.scan();
      } //
      else if (this.token.type === "identificador") {
        if (!this.A()) return false;
        this.token = this.scanner.scan();
      } //
      else if (this.token.type === "palabra clave") {
        if (!this.controlStructure()) return false;
      } //
      else {
        this.message = "Error: Tipo de dato/identificador/palabra clave esperado";
        return false;
      }
    }
    if (this.stack.length > 0) {
      switch (this.stack[this.stack.length - 1]) {
        case "si":
          this.message = "Error: fin_si esperado";
          break;
        case "mientras":
          this.message = "Error: fin_mientras esperado";
          break;
      }
      return false;
    }
    return true;
  }
  D() {
    if (this.simbolosDir["D"][1].includes(this.token.type)) {
      this.token = this.scanner.scan();
      if (this.token.type !== "identificador") {
        this.message = "Error: Identificador esperado despues de un tipo de dato"
        return false;
      }
      this.token = this.scanner.scan();

      if (!this.D_Q()) return false;
      if (!this.D_R()) return false;
      return true;
    }
    this.message = "Error: Tipo de dato esperado";
    return false;
  }
  D_R() {
    if (this.simbolosDir["D_R"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();
      if (this.token.type !== "identificador") {
        this.message = "Error: Identificador esperado después de la coma";
        return false;
      }
      this.token = this.scanner.scan();

      if (!this.D_Q()) return false;
      if (!this.D_R()) return false;
      return true;
    } else if (this.simbolosDir["D_R"][2].includes(this.token.value)) {
      return true;
    }
    this.message =
      "Error: Coma o punto y coma esperado después de un identificador";
    return false;
  }
  D_Q() {
    if (this.simbolosDir["D_Q"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();

      if (!this.D_E()) return false;
      return true;
    } else if (this.simbolosDir["D_Q"][2].includes(this.token.value)) {
      return true;
    }
    this.message = "Error: Punto y coma/signo igual/coma esperado";
    return false;
  }
  D_E() {
    if (this.simbolosDir["D_E"][1].includes(this.token.type)) {
      if (!this.D_T()) return false;
      if (!this.D_X()) return false;
      return true;
    }
    this.message = "Error: Identificador/número esperado";
    return false;
  }
  D_X() {
    if (this.simbolosDir["D_X"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();
      if (!this.D_T()) return false;
      if (!this.D_X()) return false;
      return true;
    } else if (this.simbolosDir["D_X"][2].includes(this.token.value)) {
      return true;
    }
    this.message = "Error: Operador/punto y coma esperado";
    return false;
  }
  D_T() {
    if (this.simbolosDir["D_T"][1].includes(this.token.type)) {
      if (!this.D_F()) return false;
      if (!this.D_Y()) return false;
      return true;
    }
    this.message = "Error: Identificador/número esperado";
    return false;
  }
  D_Y() {
    if (this.simbolosDir["D_Y"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();
      if (!this.D_F()) return false;
      if (!this.D_Y()) return false;
      return true;
    } else if (this.simbolosDir["D_Y"][2].includes(this.token.value)) {
      return true;
    }
    this.message = "Error: Operador/punto y coma esperado";
    return false;
  }
  D_F() {
    if (this.simbolosDir["D_F"][1].includes(this.token.type)) {
      this.token = this.scanner.scan();
      return true;
    }
    this.message = "Error: Identificador/número esperado";
    return false;
  }

  controlStructure() {
    let temp;

    if (this.token.value === "si" || this.token.value === "mientras") {
      this.stack.push(this.token.value);
      this.token = this.scanner.scan();
      if (this.token.value !== "(") {
        this.message =
        "Error: Se esperaba un paréntesis de apertura después de la palabra clave de la estructura de control";
        return false;
      }
      this.token = this.scanner.scan();
      if (!this.C()) return false;
      if (this.token.value !== ")") {
        this.message = "Error: Se esperaba un paréntesis de cierre después de la condición";
        return false;
      }
      this.token = this.scanner.scan();
      if (
        this.token.value === "$" ||
        this.token.value === "fin_si" ||
        this.token.value === "fin_mientras"
      ) {
        this.message = "Error: Se esperaba una instrucción después de la condición";
        return false;
      }
      return true;
    } else if (
      this.token.value === "fin_si" ||
      this.token.value === "fin_mientras"
    ) {
      temp = this.token.value;
      if (
        this.stack[this.stack.length - 1] ===
        `${this.token.value.split("_")[1]}`
      ) {
        this.stack.pop();
        this.token = this.scanner.scan();
        return true;
      }
      this.message = `Error: ${temp} inesperado`;
      return false;
    }
    return false;
  }

  A() {
    if (this.simbolosDir["A"][1].includes(this.token.type)) {
      this.token = this.scanner.scan();
      if (this.token.value !== "=") {
        this.message = "Error: Signo igual esperado después de un identificador";
        return false;
      }
      this.token = this.scanner.scan();
      if (!this.A_E()) return false;
      return true;
    }
    this.message = "Error: Identificador esperado";
    return false;
  }

  A_E() {
    if (this.simbolosDir["A_E"][1].includes(this.token.type)) {
      if (!this.A_T()) return false;
      if (!this.A_X()) return false;
      return true;
    }
    this.message = "Error: Identificador/número esperado";
    return false;
  }
  A_X() {
    if (this.simbolosDir["A_X"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();
      if (!this.A_T()) return false;
      if (!this.A_X()) return false;
      return true;
    } else if (this.simbolosDir["A_X"][2].includes(this.token.value)) {
      return true;
    }
    this.message = "Error: Operador/punto y coma esperado";
    return false;
  }
  A_T() {
    if (this.simbolosDir["A_T"][1].includes(this.token.type)) {
      if (!this.A_F()) return false;
      if (!this.A_Y()) return false;
      return true;
    }
    this.message = "Error: Identificador/número esperado";
    return false;
  }
  A_Y() {
    if (this.simbolosDir["A_Y"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();
      if (!this.A_F()) return false;
      if (!this.A_Y()) return false;
      return true;
    } else if (this.simbolosDir["A_Y"][2].includes(this.token.value)) {
      return true;
    }
    this.message = "Error: Operador/punto y coma esperado"
    return false;
  }
  A_F() {
    if (this.simbolosDir["A_F"][1].includes(this.token.type)) {
      this.token = this.scanner.scan();
      return true;
    }
    this.message = "Error: Identificador/número esperado";
    return false;
  }
  C() {
    if (this.simbolosDir["C"][1].includes(this.token.type)) {
      if (!this.C_T()) return false;
      if (!this.C_X()) return false;
      return true;
    }
    this.message = "Error: Identificador/número esperado";
    return false;
  }
  C_X() {
    if (this.simbolosDir["C_X"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();
      if (!this.C_T()) return false;
      if (!this.C_X()) return false;
      return true;
    } else if (this.simbolosDir["C_X"][2].includes(this.token.value)) {
      return true;
    }
    this.message = "Error: Expected operator or closing parenthesis";
    return false;
  }
  C_T() {
    if (this.simbolosDir["C_T"][1].includes(this.token.type)) {
      if (!this.C_F()) return false;
      if (!this.C_Y()) return false;
      return true;
    }
    this.message = "Error: Identificador/número esperado"
    return false;
  }
  C_Y() {
    if (this.simbolosDir["C_Y"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();
      if (!this.C_F()) return false;
      if (!this.C_Y()) return false;
      return true;
    } else if (this.simbolosDir["C_Y"][2].includes(this.token.value)) {
      return true;
    }
    this.message = "Error: Operador o paréntesis de cierre esperado"
    return false;
  }
  C_F() {
    if (this.simbolosDir["C_F"][1].includes(this.token.type)) {
      this.token = this.scanner.scan();
      return true;
    }
    this.message = "Error: Identificador/número esperado";
    return false;
  }
}

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
