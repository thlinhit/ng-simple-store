module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  coverageDirectory: "../../coverage",
  coverageReporters: ["html", "teamcity", "text-summary", "lcov"],
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|css|less)$":
      "<rootDir>/jest.mocks.ts",
    "^raw-loader!(.*)$": "<rootDir>/jest.mocks.ts",
    "@base\\/base-lib\\/(.*)": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["e2e"],
};
