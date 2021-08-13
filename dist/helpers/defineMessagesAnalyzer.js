"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefineMessagesDuplicationAnalyzer = /** @class */ (function () {
    function DefineMessagesDuplicationAnalyzer() {
        var _this = this;
        this.idTracker = {};
        this.reportDuplication = function (messageId, context, messageNode) {
            context.report({
                message: "message with id '" + messageId + "' is duplicated",
                node: messageNode,
            });
        };
        this.getMessageId = function (messageNode) {
            var messageNodeProperies = messageNode.value.type === 'ObjectExpression' ?
                _this.removeSpreadElements(messageNode.value.properties) : [];
            var messageIdNode = messageNodeProperies.find(function (messagesProperty) { return messagesProperty.key.type === 'Identifier' && messagesProperty.key.name === 'id'; });
            if ((messageIdNode == null) || messageIdNode.value.type !== 'Literal') {
                return null;
            }
            var messageId = messageIdNode.value.value;
            if (typeof messageId === 'number' || typeof messageId === 'string') {
                return messageId;
            }
            return null;
        };
        this.checkMessageDuplication = function (messageNode, context) {
            var messageId = _this.getMessageId(messageNode);
            if (messageId == null) {
                return;
            }
            var firstTrakedMessage = _this.idTracker[messageId];
            if (firstTrakedMessage == null) {
                _this.idTracker[messageId] = {
                    node: messageNode,
                    context: context,
                    isReported: false,
                };
                return;
            }
            _this.reportDuplication(messageId, context, messageNode);
            if (!firstTrakedMessage.isReported) {
                firstTrakedMessage.isReported = true;
                _this.reportDuplication(messageId, firstTrakedMessage.context, firstTrakedMessage.node);
            }
        };
        this.proceedDefineMessagesFunctionCall = function (node, context) {
            var isDefineMessagesFunctionCall = _this.getIsDefineMessagesFunctionNode(node);
            if (!isDefineMessagesFunctionCall) {
                return;
            }
            var messageNodeList = _this.getMessageNodeList(node);
            messageNodeList.forEach(function (node) { return _this.checkMessageDuplication(node, context); });
        };
        this.removeSpreadElements = function (allProperies) { return allProperies.filter(function (messageNode) { return messageNode.type === 'Property'; }); };
        this.getMessageNodeList = function (node) {
            var firstArgument = node.arguments[0];
            if (firstArgument.type !== 'ObjectExpression') {
                return [];
            }
            return _this.removeSpreadElements(firstArgument.properties);
        };
        this.getIsDefineMessagesFunctionNode = function (node) {
            var functionName = _this.getCalledFunctionName(node);
            return functionName === 'defineMessages';
        };
        this.getCalledFunctionName = function (node) {
            if (node.callee.type === 'Identifier') {
                return node.callee.name;
            }
            if (node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier') {
                return node.callee.property.name;
            }
            return null;
        };
    }
    return DefineMessagesDuplicationAnalyzer;
}());
exports.default = DefineMessagesDuplicationAnalyzer;
//# sourceMappingURL=defineMessagesAnalyzer.js.map