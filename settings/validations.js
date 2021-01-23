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
            if (typeof input === 'undefined' || isBlank(input) ) {
                console.log('this field is required!')
                return false
            }
        }
    }
    
    return true
};

module.exports = {
    confirmAnswerValidator
}