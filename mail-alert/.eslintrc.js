module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],

    // ↓↓↓ ここを追加 ↓↓↓
    "object-curly-spacing": ["error", "never"], // 波括弧の中にスペース禁止
    "comma-dangle": ["error", "always-multiline"], // 複数行の末尾にはカンマ必須
    "key-spacing": ["error", {"afterColon": true}], // コロンの後にスペース必須
    "comma-spacing": ["error", {"after": true}], // カンマの後にスペース必須
  },
};
