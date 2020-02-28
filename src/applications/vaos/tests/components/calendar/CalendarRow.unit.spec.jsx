import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';

import CalendarRow from '../../../components/calendar/CalendarRow';

describe('VAOS <CalendarRow>', () => {
  const dayCells = [
    '2019-10-21',
    '2019-10-22',
    '2019-10-23',
    '2019-10-24',
    '2019-10-25',
  ];

  const selectedDates = [
    {
      date: '2019-10-24',
      datetime: '2019-10-24T09:00:00-07:00',
    },
  ];

  const getOptionsByDate = () => [
    {
      date: '2019-10-24',
      datetime: '2019-10-24T09:00:00-07:00',
    },
    {
      date: '2019-10-25',
      datetime: '2019-10-25T09:00:00-07:00',
    },
  ];

  it('should render a row with calendar cells', () => {
    const tree = shallow(
      <CalendarRow
        cells={dayCells}
        currentlySelectedDate="2019-10-21"
        rowNumber="0"
        selectedDates={selectedDates}
        additionalOptions={{ getOptionsByDate }}
      />,
    );

    const row = tree.find('.vads-u-flex-wrap--wrap');
    expect(row.length).to.equal(1);
    const cells = tree.find('CalendarCell');
    expect(cells.length).to.equal(5);
    tree.unmount();
  });

  it('should disable cells if availableDates is provided and date is not in array', () => {
    const today = moment();

    const formatDate = (daysToAdd, date) =>
      date
        .clone()
        .add(daysToAdd, 'days')
        .format('YYYY-MM-DD');

    const cells = [
      formatDate(0, today),
      formatDate(1, today),
      formatDate(2, today),
      formatDate(3, today),
      formatDate(4, today),
    ];

    const availableDates = [cells[0], cells[2], cells[4]];

    const tree = shallow(
      <CalendarRow
        cells={cells}
        currentlySelectedDate="2019-10-21"
        rowNumber="0"
        selectedDates={selectedDates}
        additionalOptions={{ getOptionsByDate }}
        availableDates={availableDates}
      />,
    );

    const CalendarCells = tree.find('CalendarCell');
    expect(CalendarCells.at(0).props().disabled).to.be.false;
    expect(CalendarCells.at(1).props().disabled).to.be.true;
    expect(CalendarCells.at(2).props().disabled).to.be.false;
    expect(CalendarCells.at(3).props().disabled).to.be.true;
    expect(CalendarCells.at(4).props().disabled).to.be.false;
    tree.unmount();
  });
});
