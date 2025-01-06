export default class Parser {
  constructor(scanner) {
    this.scanner = scanner;
    this.message = "";
    this.stack = [];
    this.token;
    this.simbolosDir = {
      //Declaración de variable
      D: { 1: ["data type"] },
      D_R: { 1: [","], 2: [";"] },
      D_Q: { 1: ["="], 2: [",", ";"] },
      D_E: { 1: ["identificador", "número", "real"] }, // expresión
      D_X: { 1: ["+", "-"], 2: [",", ";"] },
      D_T: { 1: ["identificador", "número", "real"] }, // termino
      D_Y: { 1: ["*", "/"], 2: ["+", "-", ",", ";"] },
      D_F: { 1: ["identificador", "número", "real"] }, // factor

      // Asignación de variable
      A: { 1: ["identificador"] },
      A_E: { 1: ["identificador", "número", "real"] },
      A_X: { 1: ["+", "-"], 2: [";"] },
      A_T: { 1: ["identificador", "número", "real"] },
      A_Y: { 1: ["*", "/"], 2: ["+", "-", ";"] },
      A_F: { 1: ["identificador", "número", "real"] },

      // Condición
      C: { 1: ["identificador", "número", "real"] },
      C_X: { 1: ["&&", "||"], 2: [")"] },
      C_T: { 1: ["identificador", "número", "real"] },
      C_Y: { 1: ["<", ">", "<=", ">=", "==", "!="], 2: ["&&", "||", ")"] },
      C_F: { 1: ["identificador", "número", "real"] },
    };
  }
  parse() { // Método principal, retorna un booleano
    this.stack = [];
    this.scanner.index = 0;
    this.token = this.scanner.scan();
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
    const top = this.stack[this.stack.length - 1] ?? "";
    const input = this.token.value;
    if (input === "si" || input === "mientras") {
      this.stack.push(input);
      if (!this.recognizeCondition()) return false;
      return true;
    } else if (input === "sino") {
      if (top === "si") {
        this.token = this.scanner.scan();
        return true;
      }
      this.message = "Error: si esperado";
    } else if (input === "fin_mientras") {
      if (top === "mientras") {
        this.stack.pop();
        this.token = this.scanner.scan();
        return true;
      }
      this.message = `Error: fin_mientras inesperado`;
    } else if (input === "fin_si") {
      if (top === "si") {
        this.stack.pop();
        this.token = this.scanner.scan();
        return true;
      } else if (top === "sino") {
        this.stack.pop();
        this.stack.pop();
        this.token = this.scanner.scan();
        return true;
      }
      this.message = `Error: fin_si inesperado`;
    }
    return false;
  }

  recognizeCondition() {
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
    if (this.token.value === "$") {
      console.log(this.stack);
      let top = this.stack[this.stack.length - 1];
      if (top === "si") {
        this.message = "Error: fin_si esperado";
      } else {
        this.message = "Error: fin_mientras esperado";
      }
      return false;
    }
    return true;
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
