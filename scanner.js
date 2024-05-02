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
    this.separators = [",", "(", ")"];
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

    let token = "";
    const currentChar = this.content.charAt(this.curIndex);

    // String literal
    if (currentChar === '"') {
      token += currentChar;
      this.curIndex++;
      while (this.content.charAt(this.curIndex) !== '"') {
        token += this.content.charAt(this.curIndex);
        this.curIndex++;
      }
      token += this.content.charAt(this.curIndex);
      this.curIndex++;
      return { value: token, type: "cadena" };
    }
    // Number
    else if (/\d/.test(currentChar)) {
      while (/\d/.test(this.content.charAt(this.curIndex))) {
        token += this.content.charAt(this.curIndex);
        this.curIndex++;
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
      return { value: token, type: "separador" };
    } else {
      token += currentChar;
      this.curIndex++;
      return { value: token, type: "?" };
    }
  }
}
