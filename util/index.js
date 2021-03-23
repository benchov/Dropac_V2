import _ from 'lodash';

export const stateParser = (msg) => {
  const buffer = _.map(_.split(msg, ';'), (state) => {
    if (state !== '') {
      return _.split(state, ':');
    }
  });
  const buf2 = _.pull(buffer, undefined);
  return _.fromPairs(buf2, 'agx');
};

export const filterAndRound = (number, type) => {
  const buffer = Math.floor(number * 1000) / 100;

  if (type === 'gyroscope') {
    if (buffer > 8 && buffer > 0) {
        return 50;
    }
    if (buffer < -8 && buffer < 0) {
      return -50;
    }
    // return Math.round(buffer) * 5;
    return 0;
  }

  if (type === 'accelerometer') {
    if ((buffer > 10 && buffer > 0) || (buffer < -10 && buffer < 0)) {
      return Math.round(buffer);
    }
    return 0;
  }
};
