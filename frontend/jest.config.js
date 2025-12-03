module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // jika pakai alias @
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
