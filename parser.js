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

    debugger;
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
        this.message =
          "Error: Tipo de dato/identificador/palabra clave esperado";
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
        this.message =
          "Error: Se esperaba un paréntesis de cierre después de la condición";
        return false;
      }
      this.token = this.scanner.scan();
      if (
        this.token.value === "$" ||
        this.token.value === "fin_si" ||
        this.token.value === "fin_mientras"
      ) {
        this.message =
          "Error: Se esperaba una instrucción después de la condición";
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
  D() {
    if (this.simbolosDir["D"][1].includes(this.token.type)) {
      this.token = this.scanner.scan();
      if (this.token.type !== "identificador") {
        this.message =
          "Error: Identificador esperado despues de un tipo de dato";
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
      return true; // lambda
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
      return true; // lambda
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

  A() {
    if (this.simbolosDir["A"][1].includes(this.token.type)) {
      this.token = this.scanner.scan();
      if (this.token.value !== "=") {
        this.message =
          "Error: Signo igual esperado después de un identificador";
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
    this.message = "Error: Operador/punto y coma esperado";
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
    this.message = "Error: Operador/paréntesis de cierre esperado";
    return false;
  }
  C_T() {
    if (this.simbolosDir["C_T"][1].includes(this.token.type)) {
      if (!this.C_F()) return false;
      if (!this.C_Y()) return false;
      return true;
    }
    this.message = "Error: Identificador/número esperado";
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
    this.message = "Error: Operador o paréntesis de cierre esperado";
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
