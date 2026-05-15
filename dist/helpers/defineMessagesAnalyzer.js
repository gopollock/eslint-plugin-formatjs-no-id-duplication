"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefineMessagesDuplicationAnalyzer = /** @class */ (function () {
    function DefineMessagesDuplicationAnalyzer() {
        var _this = this;
        this.messageById = {};
        this.fileNamesById = {};
        this.messageIdsByFilename = {};
        this.reportDuplication = function (messageId, context, messageNode) {
            context.report({
                message: "message with id '" + messageId + "' is duplicated",
                node: messageNode,
            });
        };
        this.getMessageId = function (messageNode) {
            var messageNodeProperties = messageNode.value.type === 'ObjectExpression' ?
                _this.removeSpreadElements(messageNode.value.properties) : [];
            var messageIdNode = messageNodeProperties.find(function (property) { return (property.key.type === 'Identifier') && (property.key.name === 'id'); });
            if ((messageIdNode == null) || messageIdNode.value.type !== 'Literal') {
                return null;
            }
            var messageId = messageIdNode.value.value;
            if (typeof messageId === 'number' || typeof messageId === 'string') {
                return messageId;
            }
            return null;
        };
        this.clearFile = function (filename) {
            var ids = _this.messageIdsByFilename[filename];
            ids === null || ids === void 0 ? void 0 : ids.forEach(function (id) {
                var _a, _b;
                (_a = _this.fileNamesById[id]) === null || _a === void 0 ? void 0 : _a.delete(filename);
                if (((_b = _this.fileNamesById[id]) === null || _b === void 0 ? void 0 : _b.size) === 0) {
                    delete _this.fileNamesById[id];
                    delete _this.messageById[id];
                }
            });
            delete _this.messageIdsByFilename[filename];
        };
        this.trackMessageInFile = function (filename, messageId) {
            var _a, _b;
            var ids = (_a = _this.messageIdsByFilename[filename]) !== null && _a !== void 0 ? _a : new Set();
            ids.add(messageId);
            _this.messageIdsByFilename[filename] = ids;
            var fileNames = (_b = _this.fileNamesById[messageId]) !== null && _b !== void 0 ? _b : new Set();
            fileNames.add(filename);
            _this.fileNamesById[messageId] = fileNames;
        };
        this.checkMessageDuplication = function (messageNode, context) {
            var messageId = _this.getMessageId(messageNode);
            if (messageId == null) {
                return;
            }
            var filename = context.getFilename();
            var firstTrackedMessage = _this.messageById[messageId];
            if (firstTrackedMessage === undefined) {
                _this.trackMessageInFile(filename, messageId);
                _this.messageById[messageId] = { node: messageNode, context: context, isReported: false };
                return;
            }
            if (!firstTrackedMessage.isReported) {
                firstTrackedMessage.isReported = true;
                _this.reportDuplication(messageId, firstTrackedMessage.context, firstTrackedMessage.node);
            }
            _this.reportDuplication(messageId, context, messageNode);
            _this.trackMessageInFile(filename, messageId);
        };
        this.proceedDefineMessagesFunctionCall = function (node, context) {
            var isDefineMessagesFunctionCall = _this.getIsDefineMessagesFunctionNode(node);
            if (!isDefineMessagesFunctionCall) {
                return;
            }
            var messageNodeList = _this.getMessageNodeList(node);
            messageNodeList.forEach(function (node) { return _this.checkMessageDuplication(node, context); });
        };
        this.removeSpreadElements = function (allProperties) { return allProperties.filter(function (messageNode) { return messageNode.type === 'Property'; }); };
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