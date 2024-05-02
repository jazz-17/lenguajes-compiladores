class Parser {
  constructor(scanner) {
    this.scanner = scanner;
    this.message = "";
  }

  parse() {
    let token = this.scanner.scan();
    while (token.type !== "Fin") {
      // Check if the token corresponds to a variable type

      if (token.type === "data type") {
        token = this.scanner.scan();
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
      token = this.scanner.scan();
    }
    return true;
  }
}
