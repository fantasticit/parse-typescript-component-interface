const parseTypeScriptComponentInterface = require("./index");

const code = `
import React from 'react';

export interface IProps {
  /**
   * button 
   * 显示文字
   */
  text: string;
  // 点击事件
  onClick: () => void;
  // 属性 3
  props3: (arg: any) => void;
  // 属性 4
  props4: (arg: { name: string, age: number }) => React.Node
}

const Button = ({ text }) => {
  return <button>{text}</button>;
};

export default Button;
`;

let ret = parseTypeScriptComponentInterface(code);

// ```js
// {
//   "IProps": [
//     [
//       {
//         "name": "text",
//         "type": "string",
//         "comments": [
//           "button",
//           "显示文字"
//         ]
//       },
//       {
//         "name": "onClick",
//         "type": "() => void",
//         "comments": [
//           "点击事件"
//         ]
//       },
//       {
//         "name": "props3",
//         "type": "( arg: any) => void",
//         "comments": [
//           "属性 3"
//         ]
//       },
//       {
//         "name": "props4",
//         "type": "( arg: { name: string, age: number }) => React.Node",
//         "comments": [
//           "属性 4"
//         ]
//       }
//     ]
//   ]
// }
// ```;
console.log(JSON.stringify(ret, null, 2));
