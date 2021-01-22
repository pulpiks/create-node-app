const isBlank = (str) => {
    return (!str || /^\s*$/.test(str));
}

const confirmAnswerValidator = (options = {
    required: false
}) => (input) => {
    const { allowedAnswers, required} = options;
    if (required) {
        if (typeof allowedAnswers !=='undefined') {
            if (allowedAnswers.indexOf(input) < 0) {
                return false;
            }
        } else {
            console.log(typeof input)
            if (typeof input === 'undefined' || isBlank(input) ) {
                return false
            }
        }
    }
    
    return true
};

module.exports = {
    confirmAnswerValidator
}