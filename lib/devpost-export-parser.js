const csvToJson = require('csvjson-csv2json')

/**
 * Parses csv data exported by devpost
 * 
 * @param {string} csv Csv data
 * @param {object} config config.json data
 * @returns {Object} An object containing a list of all the submissions and a list of all the categories
 */
module.exports = ( csv, config )=> {

    const Submissions = {}
    const Categories = {}

    const { titleColumn, categoryColumn } = config

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

        if( !Categories[category] )
            Categories[category] = []

        Categories[category].push(submission)

    })

    const t = config['tableNumberColumn']
    Object.keys(Categories).forEach(c=> {
        Categories[c] = Categories[c].sort((first, second)=> {
            if( first[t] > second[t] ) return 1
            if( first[t] < second[t] ) return -1
            return 0
        })
    })

    return { Submissions, Categories }
}