class Parser {
  constructor(scanner) {
    this.scanner = scanner;
    this.message = "";

    /*************************************

    S -> D S 
      -> lambda

    D -> data type identificador E R ;

    R -> , identificador E R
      -> lambda 

    E -> = X
      -> lambda 

    X -> número P 
    
    P -> operador número P
      -> lambda

    **************************************/
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

      // variable assignment
      A: {
        1: ["identificador"],
      },

      // Expression
      E: {
        1: ["identificador", "número"],
      },
      E_X: {
        1: ["+", "-"],
        2: [";"],
      },
      E_T: {
        // Term
        1: ["identificador", "número"],
      },
      E_Y: {
        1: ["*", "/"],
        2: ["+", "-", ";"],
      },
      E_F: {
        // Factor
        1: ["identificador", "número"],
      },
    };
    this.stack = []; // Used for validating control structures
    this.token;
  }
  parse() {
    this.stack = [];
    this.scanner.index = 0;
    this.token = this.scanner.scan();

    while (this.token.type !== "Fin") {
      debugger;
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
        this.message = "Error: Expected data type or control structure keyword";
        return false;
      }
    }
    return true;
  }
  D() {
    if (this.simbolosDir["D"][1].includes(this.token.type)) {
      this.token = this.scanner.scan();
      if (this.token.type !== "identificador") {
        this.message = "Error: Expected identifier after data type";
        return false;
      }
      this.token = this.scanner.scan();

      if (!this.D_Q()) return false;
      if (!this.D_R()) return false;
      return true;
    }
    this.message = "Error: Expected data type";
    return false;
  }
  D_R() {
    if (this.simbolosDir["D_R"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();
      if (this.token.type !== "identificador") {
        this.message = "Error: Expected identifier after comma";
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
      "Error: Expected comma or semicolon after variable declaration";
    return false;
  }
  D_Q() {
    if (this.simbolosDir["D_Q"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();

      if (!this.E()) return false;
      return true;
    } else if (this.simbolosDir["D_Q"][2].includes(this.token.value)) {
      return true;
    }
    this.message = "Error: Expected equals sign or comma or semicolon";
    return false;
  }
  // controlStructure() {
  //   if (this.token.value === "si") {
  //     this.stack.push("si");
  //     this.token = this.scanner.scan();
  //     if (this.token.value !== "(") {
  //       this.message = "Error: Expected opening parenthesis after if";
  //       return false;
  //     }
  //     this.token = this.scanner.scan();
  //     let result = this.
  //     if (!result) return false;
  //     if (this.token.value !== ")") {
  //       this.message = "Error: Expected closing parenthesis after condition";
  //       return false;
  //     }
  //     this.token = this.scanner.scan();
  //     // result = this.block();
  //     // if (!result) return false;
  //     return true;
  //   } else if (this.token.value === "while") {
  //     this.token = this.scanner.scan();
  //     if (this.token.value !== "(") {
  //       this.message = "Error: Expected opening parenthesis after while";
  //       return false;
  //     }
  //     this.token = this.scanner.scan();
  //     let result = this.condition();
  //     if (!result) return false;
  //     if (this.token.value !== ")") {
  //       this.message = "Error: Expected closing parenthesis after condition";
  //       return false;
  //     }
  //     this.token = this.scanner.scan();
  //     result = this.block();
  //     if (!result) return false;
  //     return true;
  //   } else if (this.token.value === "for") {
  //     this.token = this.scanner.scan();
  //     if (this.token.value !== "(") {
  //       this.message = "Error: Expected opening parenthesis after for";
  //       return false;
  //     }
  //     this.token = this.scanner.scan();
  //     let result = this.assignment();
  //     if (!result) return false;
  //     if (this.token.value !== ";") {
  //       this.message = "Error: Expected semicolon after assignment";
  //       return false;
  //     }
  //     this.token = this.scanner.scan();
  //     result = this.condition();
  //     if (!result) return false;
  //     if (this.token.value !== ";") {
  //       this.message = "Error: Expected semicolon after condition";
  //       return false;
  //     }
  //     this.token = this.scanner.scan();
  //     result = this.assignment();
  //     if (!result) return false;
  //     if (this.token.value !== ")") {
  //       this.message = "Error: Expected closing parenthesis after assignment";
  //       return false;
  //     }
  //     this.token = this.scanner.scan();
  //     result = this.block();
  //     if (!result) return false;
  //     return true;
  //   }
  //   return false;
  // }

  A() {
    if (this.simbolosDir["A"][1].includes(this.token.type)) {
      this.token = this.scanner.scan();
      if (this.token.value !== "=") {
        this.message = "Error: Expected equals sign after identifier";
        return false;
      }
      this.token = this.scanner.scan();
      if (!this.E()) return false;
      return true;
    }
    this.message = "Error: Expected identifier";
    return false;
  }

  E() {
    if (this.simbolosDir["E"][1].includes(this.token.type)) {
      if (!this.E_T()) return false;
      if (!this.E_X()) return false;
      return true;
    }
    this.message = "Error: Expected identifier or number";
    return false;
  }
  E_X() {
    if (this.simbolosDir["E_X"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();
      if (!this.E_T()) return false;
      if (!this.E_X()) return false;
      return true;
    } else if (this.simbolosDir["E_X"][2].includes(this.token.value)) {
      return true;
    }
    this.message = "Error: Expected operator  or semicolon";
    return false;
  }
  E_T() {
    if (this.simbolosDir["E_T"][1].includes(this.token.type)) {
      if (!this.E_F()) return false;
      if (!this.E_Y()) return false;
      return true;
    }
    this.message = "Error: Expected identifier or number";
    return false;
  }


  E_Y() {
    if (this.simbolosDir["E_Y"][1].includes(this.token.value)) {
      this.token = this.scanner.scan();
      if (!this.E_F()) return false;
      if (!this.E_Y()) return false;
      return true;
    } else if (this.simbolosDir["E_Y"][2].includes(this.token.value)) {
      return true;
    }
    this.message = "Error: Expected operator or semicolon";
    return false;
  }
  E_F() {
    if (this.simbolosDir["E_F"][1].includes(this.token.type)) {
      this.token = this.scanner.scan();
      return true;
    }
    this.message = "Error: Expected identifier or number";
    return false;
  }
}
