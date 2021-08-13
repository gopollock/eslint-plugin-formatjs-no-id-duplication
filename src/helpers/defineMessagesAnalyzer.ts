import { Rule } from "eslint";
import * as ESTree from 'estree';
import { Dictionary, CallExpressionNode } from "./types";

type TrackedMessage = {
  isReported: boolean,
  node: ESTree.Property,
  context: Rule.RuleContext,
}

type MessageId = string | number;

export default class DefineMessagesDuplicationAnalyzer {
  private idTracker: Dictionary<MessageId, TrackedMessage> = {};

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

  private checkMessageDuplication = (messageNode: ESTree.Property, context: Rule.RuleContext): void => {
    const messageId: string | number | null = this.getMessageId(messageNode);
    if (messageId == null) {
      return;
    }

    const firstTrakedMessage = this.idTracker[messageId];
    if (firstTrakedMessage == null) {
      this.idTracker[messageId] = {
        node: messageNode,
        context: context,
        isReported: false,
      };

      return;
    }

    this.reportDuplication(messageId, context, messageNode);

    if (!firstTrakedMessage.isReported) {
      firstTrakedMessage.isReported = true;
      this.reportDuplication(messageId, firstTrakedMessage.context, firstTrakedMessage.node);
    }
  }

  public proceedDefineMessagesFunctionCall = (node: CallExpressionNode, context: Rule.RuleContext): void => {
    const isDefineMessagesFunctionCall = this.getIsDefineMessagesFunctionNode(node);
    if (!isDefineMessagesFunctionCall) {
      return;
    }

    const messageNodeList = this.getMessageNodeList(node);
    messageNodeList.forEach((node) => this.checkMessageDuplication(node, context));
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
