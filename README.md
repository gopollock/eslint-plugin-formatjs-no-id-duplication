# eslint-plugin-formatjs-no-id-duplication

Prevents id duplication, when [react-intl](https://formatjs.io/) library is used.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install using npm or yarn `eslint-plugin-formatjs-no-id-duplication`:

```sh
npm install eslint-plugin-formatjs-no-id-duplication --save-dev
```
OR

```sh
yarn add eslint-plugin-formatjs-no-id-duplication -D
```

## Usage

Add `formatjs-no-id-duplication` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "formatjs-no-id-duplication"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "formatjs-no-id-duplication/defineMessages": 2
    }
}
```

## Supported Rules

#### No defineMessages id duplication (`defineMessages`):

Tracks duplication of id in `defineMessages` function along usage in single file and in multiple files. 

#### Valid 👍
```js
// messagesOne.js
defineMessages({
    first: {
        id: 'firstId'
    },
    second: {
        id: 'secondId'
    },
});

// messagesTwo.js
defineMessages({
    third: {
        id: 'thirdId'
    },
});
```

#### Invalid Multiple files 👎
```js
// messagesOne.js
defineMessages({
    first: {
        id: 'firstId'
    },
    second: {
        id: 'secondId'
    },
});

// messagesTwo.js
defineMessages({
    first: {
        id: 'firstId'
    },
});
```

#### Invalid Single files 👎
```js
defineMessages({
    first: {
        id: 'firstId'
    },
    firstDuplication: {
        id: 'firstId'
    },
});
```

