class Parser {
  constructor(scanner) {
    this.string = `
      entero a, b;
      entero b, c = 3;
      real x,suma, y=48;
  
  `;
    this.scanner = scanner;
    this.message = "";
  }

  parse() {
    let token = { value: "", type: "" };
    [...token] = this.scanner.scan();

    while (token.type !== "Fin") {
      // Check if the token corresponds to a variable type

      if (token.type === "data type") {
        if (!this.parseVariableDeclaration()) {
          return false;
        }
      }
      token = this.scanner.scan();
    }
    return true;
  }

  parseVariableDeclaration() {
    let token = this.scanner.scan();
    if (token.type !== "identificador") {
      this.message = "Error: Expected identifier after data type";
      return false;
    }

    token = this.scanner.scan();

    while (token.value === "," || token.value === "=") {
      if (token.value === ",") {
        token = this.scanner.scan();
        if (token.type !== "identificador") {
          this.message = "Error: Expected identifier after comma";
          return false;
        }
      } else if (token.value === "=") {
        token = this.scanner.scan();
        if (token.type !== "número") {
          this.message = "Error: Expected number after equals sign";
          return false;
        }

        //token -> number

        token = this.scanner.scan();

        if (token.value === ";") {
          this.scanner.backtrack();
        } else if (token.value === ",") {
          token = this.scanner.scan();
          if (token.type !== "identificador") {
            this.message = "Error: Expected identifier after comma";
            return false;
          }
        } else {
          this.message =
            "Error: Expected comma or semicolon after variable declaration";
          return false;
        }
      }

      token = this.scanner.scan();
    }

    if (token.value !== ";") {
      this.message = "Error: Expected semicolon after variable declaration";
      return false;
    }
  }
}
class Scanner {
    //; scanner.tokens = []; scanner.errors = []
    constructor(content) {
      this.content = content;
      this.dataTypes = ["entero", "real", "booleano", "cadena"];
      this.controlStructureKeywords = [
        "si",
        "sino",
        "mientras",
        "para",
        "hacer",
        "fin_si",
        "fin_mientras",
        "fin_para",
        "fin_hacer",
      ];
      this.operators = ["+", "-", "*", "/", "%", ">", "<", "=", "!", "&", "|"];
      this.separators = [";", ",", "(", ")"];
      this.curIndex = 0; // current index in the content
    }
  
  
    scan() {
      if (this.curIndex >= this.content.length) {
        return { value: "$", type: "Fin" }; // end of file
      }
  
      // Skip whitespaces
      while (/\s/.test(this.content.charAt(this.curIndex))) {
        this.curIndex++;
        if (this.curIndex >= this.content.length) {
          return { value: "$", type: "Fin" }; // end of file
        }
      }
  
      // Begin tokenization
      let token = "";
      const currentChar = this.content.charAt(this.curIndex);
  
    
      // String literal
      if (currentChar === '"') {
        token += currentChar;
        this.curIndex++;
        while (
          this.content.charAt(this.curIndex) !== '"' &&
          this.curIndex < this.content.length
        ) {
          token += this.content.charAt(this.curIndex);
          this.curIndex++;
        }
        if (this.content.charAt(this.curIndex) !== '"') {
          return { value: token, type: "error" };
        }
  
        token += this.content.charAt(this.curIndex);
        this.curIndex++;
        return { value: token, type: "cadena" };
      }
      // Number
      else if (/\d/.test(currentChar)) {
        while (
          /\s/.test(this.content.charAt(this.curIndex)) === false &&
          this.curIndex < this.content.length
        ) {
          token += this.content.charAt(this.curIndex);
          this.curIndex++;
        }
        if (/\D/.test(token)) {
          return { value: token, type: "error" };
        }
        return { value: token, type: "número" };
      }
  
      // Identifier / control structure keyword / data type
      else if (/[a-zA-Z_]/.test(currentChar)) {
        while (/\w/.test(this.content.charAt(this.curIndex))) {
          token += this.content.charAt(this.curIndex);
          this.curIndex++;
          if (this.curIndex >= this.content.length) {
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
      else if (this.operators.includes(currentChar)) {
        token += currentChar;
        this.curIndex++;
        if (this.curIndex >= this.content.length) {
          return { value: token, type: "operador" };
        }
  
        const nextChar = this.content.charAt(this.curIndex);
  
        // Check for compound operators and increment curIndex accordingly
        if ((currentChar === "<" || currentChar === ">") && nextChar === "=") {
          token += nextChar;
          this.curIndex++;
        } else if (
          ["+", "-", "*", "/", "%"].includes(currentChar) &&
          (currentChar === nextChar || nextChar === "=")
        ) {
          token += nextChar;
          this.curIndex++;
        } else if (["&", "|"].includes(currentChar) && nextChar === currentChar) {
          token += nextChar;
          this.curIndex++;
        } else if (currentChar === "!" && nextChar === "=") {
          token += nextChar;
          this.curIndex++;
        }
  
        return { value: token, type: "operador" };
      }
      // Separator
      else if (this.separators.includes(currentChar)) {
        token += currentChar;
        this.curIndex++;
  
        let type;
        if (currentChar === ";") {
          type = "semicolon";
        } else if (currentChar === ",") {
          type = "comma";
        } else {
          type = "separador";
        }
        return { value: token, type: type };
      } else {
        token += currentChar;
        this.curIndex++;
        return { value: token, type: "?" };
      }
    }
    backtrack() {
      this.curIndex--;
    }
  }


  // parse() {
  //   this.flag = true;
  //   this.scanner.index = 0;
  //   debugger;
  //   this.token = this.scanner.scan();
  //   this.S();
  //   if (this.token.value !== "$") {
  //     this.message = "Error. Expected end of file";
  //     this.flag = false;
  //   }
  // }
  // S() {
  //   if (this.parseTable.S[1].includes(this.token.type)) {
  //     this.D();
  //     this.S();
  //   } else if (this.parseTable.S[2].includes(this.token.type)) {
      
  //     return;
  //   } else {
  //     this.message = "Error: Expected variable declaration or end of file";
  //     console.log(this.message);

  //     return;
  //   }
  // }
  // D() {
  //   if (this.parseTable.D[1].includes(this.token.type)) {
  //     this.token = this.scanner.scan();
  //     if (this.token.type !== "identificador") {
  //       this.message = "Error: Expected identifier after data type";
  //       console.log(this.message);
  //       return;
  //     }
  //     this.token = this.scanner.scan();
  //     this.R();
  //     if (this.token.value !== ";") {
  //       this.message = "Error: Expected semicolon after variable declaration";
  //       console.log(this.message);

  //       return;
  //     }
  //     this.token = this.scanner.scan();
  //   } else {
  //     this.message = "Error: Expected data type";
  //     console.log(this.message);

  //     return false;
  //   }
  // }
  // R() {
  //   if (this.parseTable.R[1].includes(this.token.value)) {
  //     this.token = this.scanner.scan();
  //     if (this.token.type !== "identificador") {
  //       this.message = "Error: Expected identifier after comma";
  //       console.log(this.message);

  //       return;
  //     }
  //     this.token = this.scanner.scan();
  //     this.E();
  //     this.R();
  //   } else if (this.parseTable.R[2].includes(this.token.value)) {
  //     return;
  //   } else {
  //     this.message =
  //       "Error: Expected comma or semicolon after variable declaration";
  //     console.log(this.message);

  //     return;
  //   }
  // }
  // E() {
  //   if (this.parseTable.E[1].includes(this.token.value)) {
  //     this.token = this.scanner.scan();
  //     this.X();
  //   } else if (this.parseTable.E[2].includes(this.token.value)) {
  //     return;
  //   } else {
  //     this.message = "Error: Expected equals sign or comma or semicolon";
  //     console.log(this.message);

  //     return;
  //   }
  // }
  // X() {
  //   if (this.parseTable.X[1].includes(this.token.type)) {
  //     this.token = this.scanner.scan();
  //     this.P();
  //   } else {
  //     this.message = "Error: Expected number";
  //     console.log(this.message);

  //     return;
  //   }
  // }
  // P() {
  //   if (this.parseTable.P[1].includes(this.token.type)) {
  //     this.token = this.scanner.scan();
  //     if (this.token.type !== "número") {
  //       this.message = "Error: Expected number after operator";
  //       console.log(this.message);

  //       return;
  //     }
  //     this.token = this.scanner.scan();
  //     this.P();
  //   } else if (this.parseTable.P[2].includes(this.token.value)) {
  //     return;
  //   } else {
  //     this.message = "Error: Expected operator or comma or semicolon";
  //     console.log(this.message);

  //     return;
  //   }
  // }
  