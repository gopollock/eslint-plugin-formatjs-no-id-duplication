import { Rule } from "eslint";
import DuplicationAnalyzer from "../helpers/defineMessagesAnalyzer";
import { CallExpressionNode } from "../helpers/types";

const duplicationAnalyzer = new DuplicationAnalyzer();

export default {
  create: (context: Rule.RuleContext): Rule.NodeListener => ({
    CallExpression: (node: CallExpressionNode) => {
      duplicationAnalyzer.proceedDefineMessagesFunctionCall(node, context);
    },
  }),
} as Rule.RuleModule;
