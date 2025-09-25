const uiConfig = {
  testEnvironment: "jsdom",
  reporters: [
    "default",
    ["jest-junit", {
      "suiteNameTemplate": "{filepath}",
      "outputDirectory": ".",
      "outputName": "junit.xml"
    }]
  ],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "html", "text-summary", "cobertura"],
  roots: ["tests"],
  transform: {
    "^.+\\.(ts|tsx)?$": ["ts-jest", {
      diagnostics: false,
      tsconfig: "tsconfig.test.json"
    }],
  },
  moduleNameMapper: {
    "svgbundle": "<rootDir>/tests/empty-module.js",
    "\\.(css|scss|html)$": "<rootDir>/tests/empty-module.js"
  },
  testMatch: [
    "<rootDir>/tests/*.{test,spec}.{ts,tsx}",
    "<rootDir>/tests/tables/*.{test,spec}.{ts,tsx}",
  ],  
  // testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ['<rootDir>/jest.config.js', 'jest-canvas-mock'], //see https://github.com/hustcc/jest-canvas-mock/issues/2
};

const nodeConfig = JSON.parse(JSON.stringify(uiConfig));
nodeConfig.testEnvironment = "node";
nodeConfig.testMatch = [
    "<rootDir>/tests/mongo/*.{test,spec}.{ts,tsx}",
],  
nodeConfig.moduleNameMapper = {
  "\\.(css|scss|html|svg)$": "<rootDir>/tests/empty-module.js"
};

module.exports = {
  projects: [uiConfig, nodeConfig]
};
