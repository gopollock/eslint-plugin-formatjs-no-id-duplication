import { RuleTester } from 'eslint';
import defineMessagesRule from '../src/rules/defineMessages';

const ruleTester = new RuleTester();

ruleTester.run('defineMessages rule. Single file usage', defineMessagesRule, {
  valid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: 'single_firstId',
          defaultMessage: 'first default Message',
        },
        secondMessage: {
          id: 'single_secondId',
          defaultMessage: 'second default message',
        },
      })`,
      filename: 'singleValidMessage.ts',
    },
  ],
  invalid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: 'single_thirdId',
          defaultMessage: 'first default Message',
        },
        secondMessage: {
          id: 'single_thirdId',
          defaultMessage: 'second default message',
        },
      })`,
      errors: [
        { message: `message with id 'single_thirdId' is duplicated` },
        { message: `message with id 'single_thirdId' is duplicated` },
      ],
      filename: 'singleInvalidMessage.ts',
    },
  ],
});

ruleTester.run('defineMessages rule. Multiple files usage', defineMessagesRule, {
  valid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: 'multiple_firstId',
          defaultMessage: 'first default Message',
        },
      })`,
      filename: 'messagesOne.ts',
    },
    {
      code: `defineMessages({
        secondMessage: {
          id: 'multiple_secondId',
          defaultMessage: 'second default message',
        },
      })`,
      filename: 'messagesTwo.ts',
    },
  ],
  invalid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: 'multiple_firstId',
          defaultMessage: 'first default Message',
        },
      })`,
      filename: 'messagesThree.ts',
      errors: [{ message: `message with id 'multiple_firstId' is duplicated` }],
    },
  ],
});

ruleTester.run('defineMessages creates errors count equal to the same id usage amount', defineMessagesRule, {
  valid: [],
  invalid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: 'errorsAmountCheck',
        },
        firstMessage: {
          id: 'errorsAmountCheck',
        },
        firstMessage: {
          id: 'errorsAmountCheck',
        },
      })`,
      errors: [
        { message: `message with id 'errorsAmountCheck' is duplicated` },
        { message: `message with id 'errorsAmountCheck' is duplicated` },
        { message: `message with id 'errorsAmountCheck' is duplicated` },
      ],
    },
  ],
});

ruleTester.run('defineMessages processes same file multiple times do not give error', defineMessagesRule, {
  valid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: 'reusedId',
          defaultMessage: 'first default Message',
        },
      })`,
      filename: 'sameFile.ts',
    },
    {
      code: `defineMessages({
        secondMessage: {
          id: 'reusedId',
          defaultMessage: 'second default message',
        },
      })`,
      filename: 'sameFile.ts',
    },
  ],
  invalid: [],
});


ruleTester.run('defineMessages duplicate then fix scenario. Step 1: initial valid state', defineMessagesRule, {
  valid: [
    {
      code: `defineMessages({
        message: {
          id: 'duplicateAndFixScenario_id',
          defaultMessage: 'message',
        },
      })`,
      filename: 'duplicateAndFix.ts',
    },
  ],
  invalid: [],
});

ruleTester.run('defineMessages duplicate then fix scenario. Step 2: duplicate introduced', defineMessagesRule, {
  valid: [],
  invalid: [
    {
      code: `defineMessages({
        message: {
          id: 'duplicateAndFixScenario_id',
          defaultMessage: 'message',
        },
      })`,
      filename: 'duplicateAndFixAnotherFile.ts',
      errors: [{ message: `message with id 'duplicateAndFixScenario_id' is duplicated` }],
    },
  ],
});

ruleTester.run(
  'defineMessages duplicate then fix scenario. Step 3: duplicate removed, valid again',
  defineMessagesRule,
  {
    valid: [
      {
        code: `defineMessages({
          message: {
            id: 'nonDuplicatedId',
            defaultMessage: 'fixed message',
          },
        })`,
        filename: 'duplicateAndFixAnotherFile.ts',
      },
    ],
    invalid: [],
  }
);
