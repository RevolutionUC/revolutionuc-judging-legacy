/**
 * Function to assign a project to group.
 * Returns false if the group has already been assigned the project or the group is at its limit.
 * Returns true if the assignment was successful
 * 
 * @param {string} project Submission title of the project being assigned
 * @param {Object} group Group object being assigned the project
 * @param {string[]} group.projects List of projects assigned to this group
 * @param {number} limit Maximum number of projects a group can be assigned
 * 
 * @returns {boolean} Whether the assignment was successful
 */
const assignProject = ( project, group, limit )=> {
    if( group.projects.length >= limit ) {
        return false
    }
    if( group.projects.includes( project ) ) {
        return false
    }
    group.projects.push( project )
    return true
}

/**
 * Plucks a random element from an array
 * @param {Object[]} array Array to choose from
 * @returns {Object} An object randomly selected from the array
 */
const randomElement = array=> {
    const length = array.length
    const randomIndex = Math.floor( Math.random() * length )
    return array[ randomIndex ]
}

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
 * Function to assign projects to groups
 * @param {string[]} projects Array of submission titles
 * @param {Object[]} groups Array of groups
 * @param {Object} config config.json data
 */
module.exports = ( projects, groups, config )=> {

    const g = groups.length
    const k = config['generalGroupsPerProject']
    const p = projects.length

    const projectsPerGroup = Math.ceil(( p / g ) * k)

    console.log({ projectsPerGroup })
    
    // shuffle project list
    shuffleArray( projects )

    // shuffle groups list 
    shuffleArray( groups )

    let groupIndex = 0

    for( let i = 0; i < k; i++ ) {
        projects.forEach( project=> {
            if( groups[groupIndex].projects.length >= projectsPerGroup )
                groupIndex++

            groups[groupIndex].projects.push( project )
        })
    }

}
