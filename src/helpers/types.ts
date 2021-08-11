import { Rule } from "eslint";
import * as ESTree from "estree";

export type Dictionary<K extends keyof any, V> = { [P in K]?: V };

export type CallExpressionNode = ESTree.CallExpression & Rule.NodeParentExtension;
