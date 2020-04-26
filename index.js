const transformCode2Ast = require("./transformCode2Ast");
const findInterfaces = require("./findInterfaces");
const parseInterfaceDefinitions = require("./parseInterfaceDefinitions");

function parseTypeScriptComponentInterface(code) {
  let ast = transformCode2Ast(code);
  let interfaces = findInterfaces(ast);
  let definitions = Object.keys(interfaces).reduce((a, c) => {
    a[c] = a[c] || [];
    a[c].push(parseInterfaceDefinitions(interfaces[c]));
    return a;
  }, Object.create(null));
  return definitions;
}

module.exports = parseTypeScriptComponentInterface;
