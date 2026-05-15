import { Rule } from "eslint";
import * as ESTree from 'estree';
import { Dictionary, CallExpressionNode } from "./types";

type TrackedMessage = {
  isReported: boolean;
  node: ESTree.Property;
  context: Rule.RuleContext;
}

type MessageId = string | number;

export default class DefineMessagesDuplicationAnalyzer {
  private messageById: Dictionary<MessageId, TrackedMessage> = {};
  private fileNamesById: Dictionary<MessageId, Set<string>> = {};
  private messageIdsByFilename: Dictionary<string, Set<MessageId>> = {};

  private reportDuplication = (
    messageId: MessageId, context: Rule.RuleContext, messageNode: ESTree.Property
  ): void => {
    context.report({
      message: `message with id '${messageId}' is duplicated`,
      node: messageNode,
    });
  }

  private getMessageId = (messageNode: ESTree.Property): number | string | null => {
    const messageNodeProperties: ESTree.Property[] = messageNode.value.type === 'ObjectExpression' ?
      this.removeSpreadElements(messageNode.value.properties) : [];

    const messageIdNode = messageNodeProperties.find(
      (property: ESTree.Property) => (property.key.type === 'Identifier') && (property.key.name === 'id')
    );

    if ((messageIdNode == null) || messageIdNode.value.type !== 'Literal') {
      return null;
    }

    const messageId = messageIdNode.value.value;
    if (typeof messageId === 'number' || typeof messageId === 'string') {
      return messageId;
    }

    return null;
  }

  public clearFile = (filename: string): void => {
    const ids = this.messageIdsByFilename[filename];

    ids?.forEach((id) => {
      this.fileNamesById[id]?.delete(filename);
      if (this.fileNamesById[id]?.size === 0) {
        delete this.fileNamesById[id];
        delete this.messageById[id];
      }
    });
    delete this.messageIdsByFilename[filename];
  }

  private trackMessageInFile = (filename: string, messageId: MessageId): void => {
    const ids = this.messageIdsByFilename[filename] ?? new Set();
    ids.add(messageId);
    this.messageIdsByFilename[filename] = ids;

    const fileNames = this.fileNamesById[messageId] ?? new Set();
    fileNames.add(filename);
    this.fileNamesById[messageId] = fileNames;
  }

  private checkMessageDuplication = (messageNode: ESTree.Property, context: Rule.RuleContext): void => {
    const messageId = this.getMessageId(messageNode);
    if (messageId == null) {
      return;
    }

    const filename = context.getFilename();
    const firstTrackedMessage = this.messageById[messageId];

    if (firstTrackedMessage === undefined) {
      this.trackMessageInFile(filename, messageId);
      this.messageById[messageId] = { node: messageNode, context, isReported: false };
      return;
    }

    if (!firstTrackedMessage.isReported) {
      firstTrackedMessage.isReported = true;
      this.reportDuplication(messageId, firstTrackedMessage.context, firstTrackedMessage.node);
    }

    this.reportDuplication(messageId, context, messageNode);
    this.trackMessageInFile(filename, messageId);
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
    allProperties: Array<ESTree.Property | ESTree.SpreadElement>
  ): ESTree.Property[] => allProperties.filter((messageNode): messageNode is ESTree.Property => messageNode.type === 'Property')

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
