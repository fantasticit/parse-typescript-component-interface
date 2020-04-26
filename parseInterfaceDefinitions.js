const get = require("lodash/get");

function parseTSTypeReference(typeName) {
  const type = get(typeName, "type");
  switch (type) {
    case "TSQualifiedName":
      return `${get(typeName, "left.name")}.${get(typeName, "right.name")}`;
    default:
      return `Unknown ReferenceType`;
  }
}

function parseTSFunctionType(parameters, typeAnnotation) {
  const parseTSFunctionParameters = (parameters) => {
    if (!parameters || !parameters.length) {
      return `()`;
    }
    let args = parameters.map((parameter) => {
      return `${get(parameter, "name")}: ${parseTypeAnnotation(
        get(parameter, "typeAnnotation.typeAnnotation")
      )}`;
    });
    return "( " + args.join(", ") + ")";
  };
  const parseTSFunctionReturn = (typeAnnotation) => {
    const type = get(typeAnnotation, "type");
    switch (type) {
      case "TSVoidKeyword":
        return "void";
      case "TSTypeReference":
        return parseTSTypeReference(get(typeAnnotation, "typeName"));
      default:
        return `Unknown FunctionType`;
    }
  };
  return `${parseTSFunctionParameters(parameters)} => ${parseTSFunctionReturn(
    typeAnnotation
  )}`;
}

function parseTSTypeLiteral(members) {
  const ret = parseInterfaceDefinitions(members);
  let args = ret.map((t) => `${t.name}: ${t.type}`);
  return "{ " + args.join(", ") + " }";
}

function parseTypeAnnotation(typeAnnotation) {
  const type = get(typeAnnotation, "type");
  switch (type) {
    case "TSNumberKeyword":
    case "TSStringKeyword":
    case "TSBoleanKeyword":
    case "TSNullKeyword":
    case "TSUndefinedKeyword":
    case "TSSymbolKeyword":
    case "TSAnyKeyword":
      return type.match(/TS(\w+)Keyword/)[1].toLowerCase();
    case "TSUnionType":
      return get(typeAnnotation, "types", [])
        .map((type) => get(type, "literal.value"))
        .join(" | ");
    case "TSFunctionType":
      return parseTSFunctionType(
        get(typeAnnotation, "parameters"),
        get(typeAnnotation, "typeAnnotation.typeAnnotation")
      );
    case "TSTypeReference":
      return parseTSTypeReference(get(typeAnnotation, "typeName"));
    case "TSTypeLiteral":
      return parseTSTypeLiteral(get(typeAnnotation, "members"));
    default:
      return "UnKnowType";
  }
}

function parseInterfaceDefinitions(nodePaths) {
  const parseInterfaceDefinitionsNode = (nodePath) => {
    const name = get(nodePath, "key.name");
    const comments = get(nodePath, "leadingComments.0.value", "")
      .trim()
      .split(/[\r\n]/)
      .map((str) => str.trim().replace(/^\*/g, "").trim())
      .filter(Boolean);
    const typeAnnotation = get(nodePath, "typeAnnotation.typeAnnotation");
    const type = parseTypeAnnotation(typeAnnotation);
    return { name, type, comments };
  };
  return nodePaths.map(parseInterfaceDefinitionsNode);
}

module.exports = parseInterfaceDefinitions;
