const { militarizeText } = require('military-speak')

/**
 * Performs a Fisher-Yates shuffle on the input array. Mutates the original array
 * @param {string[]} array Array to be shuffled
 */
const shuffleArray = array=> {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Function to generate a number of judging groups with names
 * @param {number} length Number of judging groups to generate
 * @returns {Array} Array of projects generated with name and projects fields
 */
const groupGenerator = length=> {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const limit = alphabet.substr(0, length)
    const names = militarizeText(limit).split(' ')
    const groups = names.map(name=> ({ name: `Judging Group ${name}`, projects: [] }))
    return groups
}

/**
 * Function to assign projects to groups
 * @param {any} projects Submission data object
 * @param {Object} config config.json data
 * @returns {Array} Array of groups with a generated name and assigned project titles
 */
module.exports = ( projects, config )=> {

    const g = config['generalGroupCount']
    const k = config['generalGroupsPerProject']
    const submissions = Object.keys(projects)
    const p = submissions.length
    const groups = groupGenerator(g)

    const projectsPerGroup = Math.ceil(( p / g ) * k)

    console.log({ g, k, p, projectsPerGroup })
    
    // shuffle project list
    shuffleArray( submissions )

    let groupIndex = 0

    for( let i = 0; i < k; i++ ) {
        submissions.forEach( project=> {
            if( groups[groupIndex].projects.length >= projectsPerGroup )
                groupIndex++

            groups[groupIndex].projects.push( project )
        })
    }

    const t = config['tableNumberColumn']

    return groups.map( group=> {
        group.projects = group.projects.map(title=> projects[title]).sort((first, second)=> {
            if( first[t] > second[t] ) return 1
            if( first[t] < second[t] ) return -1
            return 0
        })
        return group
    })
}