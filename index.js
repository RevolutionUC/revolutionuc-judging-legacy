const fs = require('fs')

const config = require('./config.json')
const assigner = require('./project-to-group-assignment')
const parser = require('./devpost-export-parser')

const groups = config.groups

const data = fs.readFileSync('submission-data.csv')
const csv = data.toString()
const { Submissions, Categories } = parser({
    csv,
    titleColumn: config.titleColumn,
    categoryColumn: config.categoryColumn
})

const submissionList = Object.keys( Submissions )

assigner( submissionList, groups, config )

fs.writeFileSync('submission-data.json', JSON.stringify({ Submissions, groups, Categories }, null, 2))
