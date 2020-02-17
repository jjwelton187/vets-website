/* eslint-disable func-names, prefer-arrow-callback */

/**
 * Evaluate radio buttons for basic forward keyboard functionality:
 *
 * Radio groups can receive keyboard focus by pressing TAB
 * Each radio button can be checked by pressing the DOWN or
 * RIGHT arrow keys.
 *
 * Pass the optional boolean true to reverse the direction and
 * evaluate radio buttons from bottom to top.
 *
 * ```javascript
 *  this.demoTest = function (client) {
 *    client.allyEvaluateRadioButtons([
 *      "input[type="radio"]#1",
 *      "input[type="radio"]#2",
 *      "input[type="radio"]#3"
 *    ], client.Keys.ARROW_DOWN);
 *  };
 * ```
 *
 * @method allyEvaluateRadioButtons
 * @param {string} selectorArray The array of radio buttons to be evaluated
 * @param {object} arrowPressed Nightwatch Keys object. Expects ARROW_DOWN || ARROW_RIGHT.
 * @param {boolean} [reversed] Will reverse the array order to workw ith ARROW_UP and ARROW_LEFT.
 * @api commands
 */
exports.command = function allyEvaluateRadioButtons(
  selectorArray,
  arrowPressed,
  reversed = false,
) {
  const element = selectorArray[0];
  const client = this;

  return client.waitForElementPresent(element, 1000, function() {
    if (reversed) {
      selectorArray
        .reverse()
        .forEach(sel => this.keys(arrowPressed).assert.isActiveElement(sel));
    } else {
      selectorArray.forEach(sel =>
        this.assert.isActiveElement(sel).keys(arrowPressed),
      );
    }
  });
};