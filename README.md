# eslint-plugin-formatjs-no-id-duplication

prevents id duplication in defineMessages function from react-intl library

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-formatjs-no-id-duplication`:

```sh
npm install eslint-plugin-formatjs-no-id-duplication --save-dev
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
        "formatjs-no-id-duplication/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


