const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  const {
    ARROW_DOWN,
    ARROW_LEFT,
    ARROW_RIGHT,
    ARROW_UP,
    ENTER,
    TAB,
  } = client.Keys;

  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  // Assert the correct number of focusable elements in the form
  client.assert.hasFocusableCount('div.usa-width-two-thirds form', 15);

  // Assert the correct number of tabbable elements in the form
  client.assert.hasTabbableCount('div.usa-width-two-thirds form', 11);

  // Assert skip navigation link works correctly
  client
    .waitForElementVisible('.landing-page', Timeouts.verySlow)
    .keys(TAB)
    .assert.isActiveElement('a.show-on-focus')
    .keys(ENTER)
    .keys(TAB)
    .assert.isActiveElement('.va-nav-breadcrumbs-list > li > a');

  // Move on to the form
  client.repeatKeypress(TAB, 3).assert.isActiveElement('#militaryStatus');

  // Evaluate the military status select menu
  client.allyEvaluateSelectMenu('#militaryStatus', 'child', 'child');

  // Open and close the GI Bill Benefit modal
  client
    .keys(TAB)
    .allyEvaluateModalWindow(
      'button[aria-label="Learn more about VA education and training programs"]',
      'div[role="alertdialog"]',
      'button[aria-label="Close this modal"]',
    );

  // Evaluate the GI Bill Benefit select
  client
    .keys(TAB)
    .assert.isActiveElement('#giBillChapter')
    .allyEvaluateSelectMenu('#giBillChapter', 'montgomery', '30');

  // Open and close the enlistment modal
  client
    .keys(TAB)
    .allyEvaluateModalWindow(
      'button[aria-label="Learn more about how the length of Montgomery GI Bill active-duty service affects your benefits"]',
      'div[role="alertdialog"]',
      'button[aria-label="Close this modal"]',
    );

  // Evaluate the enlistment select
  client
    .keys(TAB)
    .assert.isActiveElement('#enlistmentService')
    .allyEvaluateSelectMenu('#enlistmentService', '2', '2');

  // Evaluate the type of institution radio group with ARROW_DOWN and ARROW_RIGHT
  client
    .keys(TAB)
    .allyEvaluateRadioButtons(
      ['input#radio-buttons-7-0', 'input#radio-buttons-7-1'],
      ARROW_DOWN,
    )
    .allyEvaluateRadioButtons(
      ['input#radio-buttons-7-0', 'input#radio-buttons-7-1'],
      ARROW_RIGHT,
    );

  // Evaluate the type of institution radio group with ARROW_UP and ARROW_LEFT in reverse order
  client
    .allyEvaluateRadioButtons(
      ['input#radio-buttons-7-0', 'input#radio-buttons-7-1'],
      ARROW_UP,
      true,
    )
    .allyEvaluateRadioButtons(
      ['input#radio-buttons-7-0', 'input#radio-buttons-7-1'],
      ARROW_LEFT,
      true,
    );

  // Skip the modal and evaluate the type of class radio group with ARROW_DOWN and ARROW_RIGHT.
  // This one is a bit unique because the second radio is pre-checked.
  client
    .repeatKeypress(TAB, 2)
    .allyEvaluateRadioButtons(
      ['input#radio-buttons-8-1', 'input#radio-buttons-8-2'],
      ARROW_DOWN,
    )
    .allyEvaluateRadioButtons(
      [
        'input#radio-buttons-8-0',
        'input#radio-buttons-8-1',
        'input#radio-buttons-8-2',
      ],
      ARROW_RIGHT,
    );

  // Evaluate the type of class radio group with ARROW_UP and ARROW_LEFT in reverse order
  client
    .allyEvaluateRadioButtons(
      [
        'input#radio-buttons-8-0',
        'input#radio-buttons-8-1',
        'input#radio-buttons-8-2',
      ],
      ARROW_UP,
      true,
    )
    .allyEvaluateRadioButtons(
      [
        'input#radio-buttons-8-0',
        'input#radio-buttons-8-1',
        'input#radio-buttons-8-2',
      ],
      ARROW_LEFT,
      true,
    );

  // Let's try to submit an incomplete form by skipping over the city typeahead
  client
    .repeatKeypress(TAB, 2)
    .assert.isDisabledElement('#search-button', false)
    .assert.isActiveElement('#search-button')
    .keys(ENTER);

  // An error should appear on the enter a city, school or name typeahead label
  client.assert.elementPresent('#search-error-message');

  client.end();
});
