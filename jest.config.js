module.exports = {
  globals: {
    "ts-jest": {
      diagnostics: false,
      tsConfig: "tsconfig.test.json"
    }
  },
  roots: ["tests"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest"
  },
  moduleNameMapper: {
    "\\.(css|scss|html)$": "<rootDir>/tests/empty-module.js"
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ['<rootDir>/jest.config.js', 'jest-canvas-mock'], //see https://github.com/hustcc/jest-canvas-mock/issues/2
};
