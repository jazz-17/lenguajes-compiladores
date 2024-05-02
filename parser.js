class Parser {
  constructor(scanner) {
    this.scanner = scanner;
  }

  printxd(){
    console.log("xd")
  }
  parse() {
    let token = this.scanner.scan();
    while (token != "$") {
      console.log(token);
      switch (token) {
        case "identifier":
          if (this.keywords.includes(this.scanner.tokens[this.curIndex])) {
            console.log("Keyword: " + this.scanner.tokens[this.curIndex]);
          } else {
            console.log("Identifier: " + this.scanner.tokens[this.curIndex]);
          }
          break;
        case "operator":
          console.log("Operator: " + this.scanner.tokens[this.curIndex]);
          break;
        case "number":
          console.log("Number: " + this.scanner.tokens[this.curIndex]);
          break;
        case "string":
          console.log("String: " + this.scanner.tokens[this.curIndex]);
          break;
        case "char":
          console.log("Char: " + this.scanner.tokens[this.curIndex]);
          break;
        case "comment":
          console.log("Comment: " + this.scanner.tokens[this.curIndex]);
          break;
        case "newline":
          console.log("Newline");
          break;
        case "whitespace":
          console.log("Whitespace");
          break;
        case "error":
          console.log("Error: " + this.scanner.errors[this.curIndex]);
          break;
        default:
          console.log("Unknown token: " + this.scanner.tokens[this.curIndex]);
          break;
      }
      token = this.scanner.scan();
    }
  }
}
