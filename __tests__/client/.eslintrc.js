const frontendEslint = {
    ...require('../../src/client/.eslintrc'),
    env: {
      'jest/globals': true,
    },
  }; // just use the frontend eslint config
  
  frontendEslint.plugins.push('jest');
  
  module.exports = frontendEslint;
  