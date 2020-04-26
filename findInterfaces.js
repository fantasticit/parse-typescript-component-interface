const { visit } = require("ast-types");

function findInterfaces(ast) {
  let ret = Object.create(null);
  let currentInterface = null;

  visit(ast, {
    visitTSInterfaceDeclaration(nodePath) {
      currentInterface = nodePath.value.id.name;
      this.traverse(nodePath);
    },
    visitTSPropertySignature(nodePath) {
      ret[currentInterface] = ret[currentInterface] || [];
      ret[currentInterface].push(nodePath.value);
      return false;
    },
  });
  return ret;
}

module.exports = findInterfaces;
