import { Rule } from "eslint";
import { CallExpressionNode } from "./types";
export default class DefineMessagesDuplicationAnalyzer {
    private messageById;
    private fileNamesById;
    private messageIdsByFilename;
    private reportDuplication;
    private getMessageId;
    clearFile: (filename: string) => void;
    private trackMessageInFile;
    private checkMessageDuplication;
    proceedDefineMessagesFunctionCall: (node: CallExpressionNode, context: Rule.RuleContext) => void;
    private removeSpreadElements;
    private getMessageNodeList;
    private getIsDefineMessagesFunctionNode;
    private getCalledFunctionName;
}
//# sourceMappingURL=defineMessagesAnalyzer.d.ts.map