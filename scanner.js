class Scanner {
  constructor(content) {
    this.content = content;
    this.keywords = [
      "auto",
      "break",
      "case",
      "char",
      "const",
      "continue",
      "default",
      "do",
      "double",
      "else",
      "enum",
      "extern",
      "float",
      "for",
      "goto",
      "if",
      "int",
      "long",
      "register",
      "return",
      "short",
      "signed",
      "sizeof",
      "static",
      "struct",
      "switch",
      "typedef",
      "union",
      "unsigned",
      "void",
      "volatile",
      "while",
    ];
    this.operators = [
      "+",
      "-",
      "*",
      "/",
      "%",
      ">",
      "<",
      "=",
      "!",
      "&",
      "|",
      "?",
      ":",
      ";",
      "(",
      ")",
      ",",
    ];
    this.curIndex = 0;
  }

  scan() {
    if (this.curIndex >= this.content.length) {
      return "$"; // end of file
    }

    // Skip whitespaces
    while (/\s/.test(this.content.charAt(this.curIndex))) {
      this.curIndex++;
      if (this.curIndex >= this.content.length) {
        return "$"; // end of file
      }
    }

    let token = "";
    const currentChar = this.content.charAt(this.curIndex);

 if (currentChar === '"') {
      // String literal
      token += currentChar;
      this.curIndex++;
      while (this.content.charAt(this.curIndex) !== '"') {
        token += this.content.charAt(this.curIndex);
        this.curIndex++;
      }
      token += this.content.charAt(this.curIndex);
      this.curIndex++;
      return token;
    } else if (/\d/.test(currentChar)) {
      // Number
      while (/\d/.test(this.content.charAt(this.curIndex))) {
        token += this.content.charAt(this.curIndex);
        this.curIndex++;
      }
      return token;
    } else if (/[a-zA-Z_]/.test(currentChar)) {
      // Identifier / Keyword
      while (/\w/.test(this.content.charAt(this.curIndex))) {
        token += this.content.charAt(this.curIndex);
        this.curIndex++;
        if (this.curIndex >= this.content.length) {
          return token;
        }
      }
      return token;
    } else if (this.isOperator(currentChar)) {
      // Operator
      token += currentChar;
      this.curIndex++;
      if (this.curIndex >= this.content.length) {
        return token;
      }
      const nextChar = this.content.charAt(this.curIndex);

      if (
        (currentChar === "<" || currentChar === ">") &&
        (nextChar === "<" || nextChar === "=" || nextChar === ">")
      ) {
        token += nextChar;
        this.curIndex++;
      } else if (
        (currentChar === "+" ||
          currentChar === "-" ||
          currentChar === "*" ||
          currentChar === "/" ||
          currentChar === "%") &&
        (currentChar === nextChar || nextChar === "=")
      ) {
        token += nextChar;
        this.curIndex++;
      } else if (
        (currentChar === "&" || currentChar === "|") &&
        (nextChar === "&" || nextChar === "|")
      ) {
        token += nextChar;
        this.curIndex++;
      } else if (currentChar === "!" && nextChar === "=") {
        token += nextChar;
        this.curIndex++;
      }
      return token;
    } else {
      token += currentChar;
      this.curIndex++;
      return token;
    }
  }

  isKeyword(token) {
    return this.keywords.includes(token);
  }

  isOperator(c) {
    return this.operators.includes(c);
  }
}
