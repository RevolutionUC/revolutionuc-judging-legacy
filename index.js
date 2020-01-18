const csvToJson = require('csvjson-csv2json')
const fs = require('fs')

const titleColumn = 'Submission Title'
const categoryColumn = 'Opt-in prize'

const config = {
    generalGroupCount: 0,
    generalJudgesPerGroup: 0,
    generalGroupsPerProject: 0
}

const Submissions = {}
const Categories = []

try {
    const data = fs.readFileSync('submission-data.csv')
    const csv = data.toString()
    const json = csvToJson(csv)
    json.forEach(submission=> {

        const submissionTitle = submission[ titleColumn ]
        const category = submission[ categoryColumn ]
        submission[ categoryColumn ] = undefined
        
        const existingSubmission = Submissions[submissionTitle]

        if( existingSubmission ) {
            existingSubmission.categories.push( category )
        } else {
            submission.categories = [ category ]
            Submissions[submissionTitle] = submission
        }

        if( !Categories.includes( category ) )
            Categories.push( category )

    })

    fs.writeFileSync('submission-data.json', JSON.stringify({ Submissions, Categories }, null, 2))
} catch( err ) {
    console.error(err)
}