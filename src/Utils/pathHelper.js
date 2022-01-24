/**
 * 
 * @param { [][] } paths 
 * @returns { number } index of shortest path / array
 */
 export const getShortestPath = (paths) => {
    let distance = 0;
    let shortestPathIndex = 0;
 
    paths.forEach((path, index) => {
       if (index === 0) {
          distance = path.length
       }
       if (path.length < distance) {
          shortestPathIndex = index
       }
    })
 
    return shortestPathIndex;
 }