import { RuleTester } from 'eslint';
import defineMessagesRule from '../src/rules/defineMessages';

const ruleTester = new RuleTester();

const SINGLE_FIRST_ID = 's_firstId';
const SINGLE_SECOND_ID = 's_secondId';
const SINGLE_THIRD_ID = 's_thirdId';

const MULTIPLE_FIRST_ID = 'm_firstId';
const MULTIPLE_SECOND_ID = 'm_secondId';


ruleTester.run('defineMessages rule single file usage', defineMessagesRule, {
  valid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: '${SINGLE_FIRST_ID}',
          defaultMessage: 'first default Message',
        },
        secondMessage: {
          id: '${SINGLE_SECOND_ID}',
          defaultMessage: 'second default message',
        },
      })`,
    },
  ],
  invalid: [
    {
      code: `defineMessages({
        firstMessage: {
          id: '${SINGLE_THIRD_ID}',
          defaultMessage: 'first default Message',
        },
        secondMessage: {
          id: '${SINGLE_THIRD_ID}',
          defaultMessage: 'second default message',
        },
      })`,
      errors: [
        {
          message: `message with id '${SINGLE_THIRD_ID}' is duplicated`,
        },
        {
          message: `message with id '${SINGLE_THIRD_ID}' is duplicated`,
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
            id: '${MULTIPLE_FIRST_ID}',
            defaultMessage: 'first default Message',
          },
        })`,
        filename: 'messagesOne.ts',
      },
      {
        code: `defineMessages({
          secondMessage: {
            id: '${MULTIPLE_SECOND_ID}',
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
            id: '${MULTIPLE_FIRST_ID}',
            defaultMessage: 'first default Message',
          },
        })`,
        filename: 'messagesOne.ts',
        errors: [
          {
            message: `message with id '${MULTIPLE_FIRST_ID}' is duplicated`,
          },
        ],
      },
      {
        code: `defineMessages({
          firstMessage: {
                id: '${MULTIPLE_FIRST_ID}',
                defaultMessage: 'first default Message',
            },
        })`,
        filename: 'messagesTwo.ts',
        errors: [
          {
            message: `message with id '${MULTIPLE_FIRST_ID}' is duplicated`,
          },
        ],
      },
    ],
});
