import { RuleTester } from 'eslint';
import defineMessagesRule from '../src/rules/defineMessages';

const ruleTester = new RuleTester();

ruleTester.run('defineMessages rule single file usage', defineMessagesRule, {
  valid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: 's_firstId',
          defaultMessage: 'first default Message',
        },
        secondMessage: {
          id: 's_secondId',
          defaultMessage: 'second default message',
        },
      })`,
    },
  ],
  invalid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: 's_thirdId',
          defaultMessage: 'first default Message',
        },
        secondMessage: {
          id: 's_thirdId',
          defaultMessage: 'second default message',
        },
      })`,
      errors: [
        {
          message: `message with id 's_thirdId' is duplicated`,
        },
        {
          message: `message with id 's_thirdId' is duplicated`,
        },
      ],
    },
  ],
});

ruleTester.run('defineMessages rule multiple files usage', defineMessagesRule, {
  valid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: 'm_firstId',
          defaultMessage: 'first default Message',
        },
      })`,
      filename: 'messagesOne.ts',
    },
    {
      code: `defineMessages({
        secondMessage: {
          id: 'm_secondId',
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
          id: 'm_firstId',
          defaultMessage: 'first default Message',
        },
      })`,
      filename: 'messagesOne.ts',
      errors: [
        {
          message: `message with id 'm_firstId' is duplicated`,
        },
      ],
    },
    {
      code: `defineMessages({
        firstMessage: {
            id: 'm_firstId',
            defaultMessage: 'first default Message',
          },
      })`,
      filename: 'messagesTwo.ts',
      errors: [
        {
          message: `message with id 'm_firstId' is duplicated`,
        },
      ],
    },
  ],
});

ruleTester.run('defineMessages creates errors count equal to the same id usage amount', defineMessagesRule, {
  valid: [],
  invalid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: 'errorsAmoutCheck',
        },
        firstMessage: {
          id: 'errorsAmoutCheck',
        },
        firstMessage: {
          id: 'errorsAmoutCheck',
        },
      })`,
      errors: [
        {
          message: `message with id 'errorsAmoutCheck' is duplicated`,
        },
        {
          message: `message with id 'errorsAmoutCheck' is duplicated`,
        },
        {
          message: `message with id 'errorsAmoutCheck' is duplicated`,
        },
      ],
    },
  ],
});
