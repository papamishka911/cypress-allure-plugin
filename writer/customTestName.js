const crypto = require('crypto-js');
const logger = require('../reporter/debug');

const gherkinKeywords = ['Before', 'After', 'Given', 'When', 'Then', 'And', 'But'];

const parseGherkinKeyword = (testName) => {
    const keyword = gherkinKeywords.find((gherkinKeyword) => {
        return testName.startsWith(gherkinKeyword);
    });

    if (keyword) {
        const statement = testName.substring(keyword.length);

        return `[${keyword}]${statement}`;
    }

    return testName;
};

const overwriteStepsNames = (test) => {
  const updatedSteps = test.steps.map((step) => {
    return { ...step, name: parseGherkinKeyword(step.name) };
  });

  return { ...test, steps: updatedSteps };
};

const overwriteTestNameMaybe = (test) => {
    const overrideIndex = test.parameters.findIndex(
        (p) => p.name === 'OverwriteTestName'
    );
    if (overrideIndex !== -1) {
        const name = test.parameters[overrideIndex].value;
        logger.writer('overwriting test "%s" name to "%s"', test.name, name);
        test.name = name;
        test.fullName = name;
        test.historyId = crypto.MD5(name).toString(crypto.enc.Hex);
        test.parameters.splice(overrideIndex, 1);
    }
    return test;
};

module.exports = { overwriteTestNameMaybe, overwriteStepsNames };
