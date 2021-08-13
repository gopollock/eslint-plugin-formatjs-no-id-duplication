import { Rule } from "eslint";
import { CallExpressionNode } from "./types";
export default class DefineMessagesDuplicationAnalyzer {
    private idTracker;
    private reportDuplication;
    private getMessageId;
    private checkMessageDuplication;
    proceedDefineMessagesFunctionCall: (node: CallExpressionNode, context: Rule.RuleContext) => void;
    private removeSpreadElements;
    private getMessageNodeList;
    private getIsDefineMessagesFunctionNode;
    private getCalledFunctionName;
}
//# sourceMappingURL=defineMessagesAnalyzer.d.ts.map