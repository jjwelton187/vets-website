/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Evaluate inputs and textareas for basic keyboard functionality:
 *
 * We will ensure the input or textarea has focus, can take key entry,
 * and returns the value we expect.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.evaluateInput('selector', 'input text');
 *  };
 * ```
 *
 * @method evaluateSelectMenu
 * @param {string} input The selector (CSS / Xpath) used to locate the element.
 * @param {string} inputText The text string that should be keyed into the input.
 * @api commands
 */
module.exports.command = function evaluateInput(input, inputText) {
  const client = this;

  return client.waitForElementPresent(input, 1000, () => {
    this.assert
      .isActiveElement(input)
      .sendKeys(input, inputText)
      .assert.value(input, inputText);
  });
};
