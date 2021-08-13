import { Rule } from "eslint";
import * as ESTree from "estree";
export declare type Dictionary<K extends keyof any, V> = {
    [P in K]?: V;
};
export declare type CallExpressionNode = ESTree.CallExpression & Rule.NodeParentExtension;
//# sourceMappingURL=types.d.ts.map