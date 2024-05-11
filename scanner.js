class Scanner {
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

    // String literal
    if (this.currentChar === '"') {
      token += this.currentChar;
      this.index++;
      while (this.currentChar !== '"' && this.index < this.content.length) {
        token += this.currentChar;
        this.index++;
      }
      if (this.currentChar !== '"') {
        this.errors.push({
          message: "Error: Expected closing quote",
          index: this.index,
        });
        return { value: token, type: "error" };
      }

      token += this.currentChar;
      this.index++;
      return { value: token, type: "cadena" };
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
          message: "Error: Invalid number",
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
      return { value: token, type: "separator" };
    } 
    // Error
    else {
      token += this.currentChar;
      this.index++;
      this.errors.push({
        message: `Error: Unexpected character ${token}`,
        index: this.index,
      });
      return { value: token, type: "error" };
    }
  }
}
