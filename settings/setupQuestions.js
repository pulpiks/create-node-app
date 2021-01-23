const { confirmAnswerValidator } =  require('./validations')

module.exports = [{
    "type": "input",
    "name": "teamName",
    "message": "Team name",
    validate: confirmAnswerValidator({required: true})
}, {
    "type": "input",
    "name": "projectName",
    "message": "Project name",
    validate: confirmAnswerValidator({required: true})
}, {
    "type": "input",
    "name": "author",
    "message": "Author",
}, {
    "type": "input",
    "name": "tests",
    "message": "Dont know yet" 
}, {
    "type": "input",
    "name": "language",
    choices: ['Javascript', 'Typescript'],
    "message": "Choose language: TS/JS",
    validate: confirmAnswerValidator({required: true})
}, {
    "type": "input",
    "name": "linter",
    "message": "Specify linter on the project:",
    choices: ['ESlint', 'Prettier'],
    default: () => {return 'ESlint'},
}]