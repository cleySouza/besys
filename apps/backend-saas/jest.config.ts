export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/index.ts',
    '!src/**/*.module.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      line: 60,
      statements: 60
    }
  }
};
