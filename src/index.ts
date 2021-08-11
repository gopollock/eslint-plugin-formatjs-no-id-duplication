import defineMessagesRule from './rules/defineMessages';

const plugin = {
  rules: {
    'defineMessages': defineMessagesRule,
  },
}

export type Plugin = typeof plugin

module.exports = plugin;
