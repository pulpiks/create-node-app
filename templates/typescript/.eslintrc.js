module.exports = {
    env: {
      node: true,
      es6: true,
      'jest/globals': true,
      commonjs: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        "ecmaVersion": 2020,
        project: './tsconfig.json',
        sourceType: 'module',
    },
    plugins: ["jest", "@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"]
  }