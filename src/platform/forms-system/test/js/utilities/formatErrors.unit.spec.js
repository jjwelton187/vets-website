import { expect } from 'chai';

import { reduceErrors } from '../../../src/js/utilities/data/formatErrors';

const chapters = {
  level1a: {
    pages: {
      uiSchema: {
        'view:error1': {},
      },
      schema: {
        // properties in schema should be ignored
        errorSix: {},
      },
    },
  },
  level1b: {
    pages: {
      uiSchema: {
        error2: {},
        cardWrapper: {
          error3: {},
          empty: {
            // errorFive: 'undefined'
          },
        },
        anotherCard: {
          'view:errorNumberFour': {},
        },
      },
      initialData: {
        // properties in initialData should be ignored
        errorFive: {},
      },
    },
  },
  level1c: {
    pages: {
      uiSchema: {
        wrap: {
          errorSix: {},
        },
      },
    },
  },
};

const errors = [
  {
    noError1: {
      __errors: [],
    },
  },
  {
    wrapper1: {
      __errors: [],
      noError2: {
        __errors: [],
      },
    },
  },
  {
    property: 'instance',
    message: 'requires property "view:error1"',
    schema: {},
    name: 'required',
    argument: 'view:error1',
    stack: 'instance requires property "view:error1"',
  },
  {
    property: 'instance',
    message: 'requires property "error2"',
    schema: {},
    name: 'required',
    argument: 'error2',
    stack: 'instance requires property "error2"',
  },
  {},
  {
    'view:noError3': {
      __errors: [],
    },
    'view:wrapper2': {
      __errors: [],
      error3: {
        __errors: ['Please select at least one type of item'],
        'view:noError4': {
          __errors: [],
        },
      },
      'view:errorNumberFour': {
        __errors: [
          'errorNumberFour placeholder',
          'errorNumberFour does not match pattern',
        ],
      },
    },
  },
  {
    property: 'instance.card1',
    message: 'requires property "errorFive"',
    schema: {},
    name: 'required',
    argument: 'errorFive',
    stack: 'instance.card1 requires property "errorFive"',
  },
  {
    errorSix: {
      __errors: ['ErrorSix message'],
    },
  },
];

const result = [
  {
    name: 'view:error1',
    message: 'We’re missing error1',
    chapter: 'level1a',
    index: 0,
  },
  {
    name: 'error2',
    message: 'We’re missing error2',
    chapter: 'level1b',
    index: 1,
  },
  {
    name: 'error3',
    message: 'Please select at least one type of item',
    chapter: 'level1b',
    index: 1,
  },
  {
    name: 'view:errorNumberFour',
    message:
      'Error number four placeholder. Error number four does not match pattern',
    chapter: 'level1b',
    index: 1,
  },
  {
    name: 'errorFive',
    message: 'We’re missing error five',
    chapter: '',
    index: -1,
  },
  {
    name: 'errorSix',
    message: 'Error six message',
    chapter: 'level1c',
    index: 2,
  },
];

describe('Process form validation errors', () => {
  it('should process the JSON schema form errors into', () => {
    expect(reduceErrors(errors, { chapters })).to.eql(result);
  });
});
