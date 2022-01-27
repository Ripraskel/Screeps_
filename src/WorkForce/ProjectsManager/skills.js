/**
 * 
 * @param { Project[]} storedProjects
 * @param { Project[]} activeProjects 
 * 
 */
 export const addActiveProjectsToStorage = (storedProjects, activeProjects) => {
    let updatedProjects = storedProjects;
    const newActiveProjects = [];

    activeProjects.forEach((activeProject) => {
       let newProject = true;
 
       // check if project already stored
       storedProjects.forEach((storedProject, index) => {
          if (activeProject.taskDestinationId === storedProject.taskDestinationId &&
              activeProject.assignmentType === storedProject.assignmentType) {
             newProject = false;
          }
       });
 
       // Add new project to list
       if (newProject) {
            newActiveProjects.push(activeProject);
       }
    })
 
    updatedProjects = updatedProjects.concat(newActiveProjects);

    // update stored projects
    Object.assign(storedProjects, updatedProjects);
 }

 /**
 * 
 * @param { Project[]} storedProjects
 * @param { Project[]} activeProjects 
 * 
 * @returns { string[]} Workers on removed projects
 * 
 * Removes the inactive projects from the storedProjects passed in be reference
 */
export const removeInactiveProjectsFromStorage = (storedProjects, activeProjects) => {
    let updatedProjects = storedProjects;
    let toBeRemovedProjectIndices = [];
    let workersOnRemovedProjects = [];

    storedProjects.forEach((storedProject, storedProjectIndex) => {
        let projectStillActive = false;
        // check if project still active
        activeProjects.forEach((activeProject) => {
            if (activeProject.taskDestinationId === storedProject.taskDestinationId &&
                activeProject.assignmentType === storedProject.assignmentType) {
                projectStillActive = true;
            }
        });

        if (!projectStillActive) {
            toBeRemovedProjectIndices.push(storedProjectIndex);
        }
    });

    // Use reverse as to not affect index positions when splicing
    toBeRemovedProjectIndices.reverse().forEach(index => {
        // Add workers on to be deleted project to list
        workersOnRemovedProjects = workersOnRemovedProjects.concat(storedProjects[index].workerIds);

        // Remove the project from storeProjects
        updatedProjects.splice(index, 1);
    });

    // Update master copy of storedProjects
    Object.assign(storedProjects, updatedProjects);

    return workersOnRemovedProjects;
};
