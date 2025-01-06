export default class Scanner {
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
  }

  set index(i) {
    this._index = i;
    this.currentChar = this.content.charAt(i);
  }
  get index() {
    return this._index;
  }
  scan() {
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
      return { value: token, type: "error" };
    }
  }
}
