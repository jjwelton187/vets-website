import { expect } from 'chai';
import moment from 'moment';
import externalServiceStatus from '../config/externalServiceStatus';
import defaultExternalServices from '../config/externalServices';
import * as downtimeHelpers from '../util/helpers';

const pastDowntime = {
  attributes: {
    externalService: 'dslogon',
    startTime: moment()
      .subtract(1, 'hour')
      .toISOString(),
    endTime: moment()
      .subtract(1, 'minute')
      .toISOString(),
  },
};

const activeDowntime = {
  attributes: {
    externalService: 'evss',
    startTime: moment()
      .subtract(1, 'day')
      .toISOString(),
    endTime: moment()
      .add(1, 'day')
      .toISOString(),
  },
};

const distantFutureDowntime = {
  attributes: {
    externalService: 'vic',
    startTime: moment()
      .add(1, 'day')
      .toISOString(),
    endTime: moment()
      .add(2, 'day')
      .toISOString(),
  },
};

const approachingDowntime = {
  attributes: {
    externalService: 'mvi',
    startTime: moment()
      .add(10, 'minute')
      .toISOString(),
    endTime: moment()
      .add(1, 'day')
      .toISOString(),
  },
};

const lessUrgentApproachingDowntime = {
  attributes: {
    externalService: 'appeals',
    startTime: moment()
      .add(15, 'minute')
      .toISOString(),
    endTime: moment()
      .add(1, 'day')
      .toISOString(),
  },
};

const maintenanceWindows = [
  pastDowntime,
  activeDowntime,
  distantFutureDowntime,
  approachingDowntime,
  lessUrgentApproachingDowntime,
];

describe('getStatusForTimeframe', () => {
  it('assigns a status according to timeframe', () => {
    expect(
      downtimeHelpers.getStatusForTimeframe(
        pastDowntime.attributes.startTime,
        pastDowntime.attributes.endTime,
      ),
    ).to.equal(externalServiceStatus.ok);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        activeDowntime.attributes.startTime,
        activeDowntime.attributes.endTime,
      ),
    ).to.equal(externalServiceStatus.down);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        approachingDowntime.attributes.startTime,
        approachingDowntime.attributes.endTime,
      ),
    ).to.equal(externalServiceStatus.downtimeApproaching);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        lessUrgentApproachingDowntime.attributes.startTime,
        lessUrgentApproachingDowntime.attributes.endTime,
      ),
    ).to.equal(externalServiceStatus.downtimeApproaching);
    expect(
      downtimeHelpers.getStatusForTimeframe(
        distantFutureDowntime.attributes.startTime,
        distantFutureDowntime.attributes.endTime,
      ),
    ).to.equal(externalServiceStatus.ok);
  });
});

describe('createGlobalMaintenanceWindow', () => {
  const startTime = '2020-01-15 12:01';
  const endTime = '2020-01-16 12:01';
  const globalWindow = {
    attributes: {
      externalService: 'global',
      startTime,
      endTime,
    },
  };

  it('generates a "/maintenance_windows" response for each downed service', () => {
    const globalMaintWindow = downtimeHelpers.createGlobalMaintenanceWindow({
      startTime,
      endTime,
      externalServices: { mvi: 'mvi' },
    });

    expect(globalMaintWindow.length).to.eql(2);
    expect(globalMaintWindow[0]).to.eql(globalWindow);
    expect(globalMaintWindow[1]).to.eql({
      attributes: {
        externalService: 'mvi',
        startTime,
        endTime,
      },
    });
  });

  it('uses the default external services when none are provided', () => {
    const globalMaintWindow = downtimeHelpers.createGlobalMaintenanceWindow({
      startTime,
      endTime,
    });

    // The +1 is to account for the global service
    expect(globalMaintWindow.length).to.eql(
      Object.keys(defaultExternalServices).length + 1,
    );
  });
});

describe('createServiceMap', () => {
  it('creates a map using the attributes.externalService property as keys', () => {
    const serviceMap = downtimeHelpers.createServiceMap(maintenanceWindows);
    const evss = serviceMap.get('evss');
    const vic = serviceMap.get('vic');
    const mvi = serviceMap.get('mvi');
    const appeals = serviceMap.get('appeals');

    expect(evss.status).to.equal(externalServiceStatus.down);
    expect(vic.status).to.equal(externalServiceStatus.ok);
    expect(mvi.status).to.equal(externalServiceStatus.downtimeApproaching);
    expect(appeals.status).to.equal(externalServiceStatus.downtimeApproaching);
  });
});

describe('getMostUrgentDowntime', () => {
  let serviceMap = null;

  before(() => {
    serviceMap = downtimeHelpers.createServiceMap(maintenanceWindows);
  });

  it('returns null when all services are ok', () => {
    expect(downtimeHelpers.getSoonestDowntime(serviceMap, ['dslogon', 'vic']))
      .to.be.null;
  });

  it('returns the status with the soonest startTime and endTime that is not in the past', () => {
    const evss = downtimeHelpers.getSoonestDowntime(serviceMap, [
      'dslogon',
      'evss',
      'vic',
      'mvi',
    ]);
    expect(evss.status).to.equal(externalServiceStatus.down);
    expect(evss.externalService).to.equal('evss');

    const mvi = downtimeHelpers.getSoonestDowntime(serviceMap, [
      'dslogon',
      'vic',
      'mvi',
      'appeals',
    ]);
    expect(mvi.status).to.equal(externalServiceStatus.downtimeApproaching);
    expect(mvi.externalService).to.equal('mvi');

    const appeals = downtimeHelpers.getSoonestDowntime(serviceMap, [
      'dslogon',
      'vic',
      'appeals',
    ]);
    expect(appeals.status).to.equal(externalServiceStatus.downtimeApproaching);
    expect(appeals.externalService).to.equal('appeals');
  });
});

describe('isGlobalDowntimeInProgress', () => {
  it('returns true when in middle of downtime', () => {
    expect(
      downtimeHelpers.isGlobalDowntimeInProgress({
        downtimeStart: activeDowntime.attributes.startTime,
        downtimeEnd: activeDowntime.attributes.endTime,
      }),
    ).to.be.true;
  });

  it('returns false when downtime is in the past', () => {
    expect(
      downtimeHelpers.isGlobalDowntimeInProgress({
        downtimeStart: pastDowntime.attributes.startTime,
        downtimeEnd: pastDowntime.attributes.endTime,
      }),
    ).to.be.false;
  });

  it('returns false when downtime is in the future', () => {
    expect(
      downtimeHelpers.isGlobalDowntimeInProgress({
        downtimeStart: approachingDowntime.attributes.startTime,
        downtimeEnd: approachingDowntime.attributes.endTime,
      }),
    ).to.be.false;
  });
});
