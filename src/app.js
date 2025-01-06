import Scanner from "./classes/scanner.js";
import Parser from "./classes/parser.js";
import interpretCode from "./classes/arithmetic.js";

const scanner = new Scanner("");
const parser = new Parser(scanner);

function getToken() {
    let token = scanner.scan();
    document.querySelectorAll(".code-editor")[1].value = `${token.value}\n\n(${token.type})`;
}

function parseString() {
    let result = parser.parse();
    if (!result) {
        document.querySelectorAll(".code-editor")[3].value = parser.message;
        return;
    }
    document.querySelectorAll(".code-editor")[3].value = "La cadena es correcta";
}


document.getElementById("scanner-button").addEventListener("click", getToken);
document.getElementById("scanner-input").addEventListener("input", function ($event) {
    scanner.content = $event.target.value;
    scanner.index = 0;
});
document.getElementById("parser-button").addEventListener("click", parseString);
document.getElementById("parser-input").addEventListener("input", function ($event) {
    scanner.content = $event.target.value;
    scanner.index = 0;
    parser.message = ''
});
document.getElementById("interpret-button").addEventListener("click", interpretCode);
document.addEventListener("DOMContentLoaded", function () {
    var parserTextArea = document.getElementById("parser-input");
    parserTextArea.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            event.preventDefault();

            var start = this.selectionStart;
            var end = this.selectionEnd;

            this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
        }
    });
    var scannerTextArea = document.getElementById("scanner-input");
    scannerTextArea.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            event.preventDefault();

            var start = this.selectionStart;
            var end = this.selectionEnd;

            this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

            this.selectionStart = this.selectionEnd = start + 1;
        }
    });
});


