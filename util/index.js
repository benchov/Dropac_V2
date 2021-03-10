export const stateParser = (msg) => {
    const buffer = _.map(_.split(msg, ';'), (state) => {
        if (state !== '') {
            return _.split(state, ':');
        }
    });
    const buf2 = _.pull(buffer, undefined);
    return _.fromPairs(buf2, 'agx');
};

export const filterAndRound = (number)=> {
    const buffer = Math.floor(number * 1000) / 100;
    
    if ( (buffer > 10 && buffer > 0) || (buffer < -10 && buffer < 0) ) {
        return buffer
    }
    return 0;
}