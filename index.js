const csvToJson = require('csvjson-csv2json')
const fs = require('fs')

const config = {
    generalGroupCount: 0,
    generalJudgesPerGroup: 0,
    generalGroupsPerProject: 0,
    categories: []
}

try {
    const data = fs.readFileSync('submission-data.csv')
    const csv = data.toString()
    const json = csvToJson(csv)
} catch( err ) {
    console.error(err)
}