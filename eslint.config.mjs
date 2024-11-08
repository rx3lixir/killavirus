import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    rules: { "no-unused-vars": "warn", "no-undef": "warn" },
    languageOptions: { globals: globals.browser },
  },
];

