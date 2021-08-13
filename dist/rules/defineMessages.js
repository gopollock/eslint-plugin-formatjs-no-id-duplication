"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var defineMessagesAnalyzer_1 = __importDefault(require("../helpers/defineMessagesAnalyzer"));
var duplicationAnalyzer = new defineMessagesAnalyzer_1.default();
exports.default = {
    create: function (context) { return ({
        CallExpression: function (node) {
            duplicationAnalyzer.proceedDefineMessagesFunctionCall(node, context);
        },
    }); },
};
//# sourceMappingURL=defineMessages.js.map