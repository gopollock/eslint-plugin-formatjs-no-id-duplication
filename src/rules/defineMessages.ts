import { Rule } from "eslint";
import DuplicationAnalyzator from "../helpers/defineMessagesAnalyzator";
import { CallExpressionNode } from "../helpers/types";

const duplicationAnalyzator = new DuplicationAnalyzator();

export default {
  create: (context: Rule.RuleContext): Rule.NodeListener => {
    duplicationAnalyzator.setContext(context);

    return {
      CallExpression: (node: CallExpressionNode) => {
        duplicationAnalyzator.proceedDefineMessagesFunctionCall(node);
      },
    };
  },
} as Rule.RuleModule;
