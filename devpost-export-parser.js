const csvToJson = require('csvjson-csv2json')

/**
 * Parses csv data exported by devpost
 * 
 * @param {string} csv Csv data
 * @param {string} titleColumn Header of the column used for submission title
 * @param {string} categoryColumn Header of the column used for submission category
 * 
 * @returns {Object} An object containing a list of all the submissions and a list of all the categories
 */
module.exports = ({ csv, titleColumn, categoryColumn })=> {

    const Submissions = {}
    const Categories = []

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

    return { Submissions, Categories }
}