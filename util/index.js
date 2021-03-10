export const stateParser = (msg) => {
    const buffer = _.map(_.split(msg, ';'), (state) => {
        if (state !== '') {
            return _.split(state, ':');
        }
    });
    const buf2 = _.pull(buffer, undefined);
    return _.fromPairs(buf2, 'agx');
};