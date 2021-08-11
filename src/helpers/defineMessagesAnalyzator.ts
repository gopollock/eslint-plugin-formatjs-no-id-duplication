import { Rule } from "eslint";
import * as ESTree from 'estree';
import { Dictionary, CallExpressionNode } from "./types";

type TrackedMessage = {
  isReported: boolean,
  node: ESTree.Property,
  context: Rule.RuleContext,
}

type MessageId = string | number;

export default class DefineMessagesDuplicationAnalyzator {
  private idTracker: Dictionary<MessageId, TrackedMessage> = {};
  private context?: Rule.RuleContext;

  public setContext = (context: Rule.RuleContext): void => {
    this.context = context;
  }

  private reportDuplication = (
    messageId: MessageId, context: Rule.RuleContext, messageNode: ESTree.Property
  ): void  => {
    context.report({
      message: `message with id '${messageId}' is duplicated`,
      node: messageNode,
    });
  }

  private getMessageId = (messageNode: ESTree.Property): number | string | null => {
    const messageNodeProperies: ESTree.Property[] = messageNode.value.type === 'ObjectExpression' ?
      this.removeSpreadElements(messageNode.value.properties) : [];

    const messageIdNode = messageNodeProperies.find((messagesProperty: ESTree.Property) => messagesProperty.key.type === 'Identifier' && messagesProperty.key.name === 'id');

    if ((messageIdNode == null) || messageIdNode.value.type !== 'Literal') {
      return null;
    }

    const messageId = messageIdNode.value.value;
    if (typeof messageId === 'number' || typeof messageId === 'string') {
      return messageId;
    }

    return null;
  }

  private checkMessageDuplication = (messageNode: ESTree.Property): void => {
    const messageId: string | number | null = this.getMessageId(messageNode);
    if (!messageId || (this.context == null)) {
      return;
    }

    const isDuplication = !(this.idTracker[messageId] == null);
    if (!isDuplication) {
      this.idTracker[messageId] = {
        node: messageNode,
        context: this.context,
        isReported: false,
      };

      return;
    }

    this.reportDuplication(messageId, this.context, messageNode);

    const firstTrakedMessage = this.idTracker[messageId];
    if ((firstTrakedMessage != null) && !firstTrakedMessage.isReported) {
      this.reportDuplication(messageId, firstTrakedMessage.context, firstTrakedMessage.node);
    }
  }

  public proceedDefineMessagesFunctionCall = (node: CallExpressionNode): void => {
    const isDefineMessagesFunctionCall = this.getIsDefineMessagesFunctionNode(node);
    if (!isDefineMessagesFunctionCall) {
      return;
    }

    const messageNodeList = this.getMessageNodeList(node);
    messageNodeList.forEach(this.checkMessageDuplication);
  }

  private removeSpreadElements = (
    allProperies: Array<ESTree.Property | ESTree.SpreadElement>
  ): ESTree.Property[] => allProperies.filter((messageNode): messageNode is ESTree.Property => messageNode.type === 'Property')

  private getMessageNodeList = (node: CallExpressionNode): ESTree.Property[] => {
    const firstArgument = node.arguments[0];

    if (firstArgument.type !== 'ObjectExpression') {
      return [];
    }

    return this.removeSpreadElements(firstArgument.properties);
  }

  private getIsDefineMessagesFunctionNode = (node: CallExpressionNode): boolean => {
    const functionName = this.getCalledFunctionName(node);

    return functionName === 'defineMessages';
  }

  private getCalledFunctionName = (node: CallExpressionNode): string | null => {
    if (node.callee.type === 'Identifier') {
      return node.callee.name;
    }

    if (node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier') {
      return node.callee.property.name;
    }

    return null;
  }
}
