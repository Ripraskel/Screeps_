import { worker_assignment_type } from '../Worker/assignments';
import { getShortestPath } from '../Utils/pathHelper';

/**
 * 
 * @param { Project[]} projects 
 * @param {number} numberOfWorkers 
 * 
 * @returns {string[]} UnassignedWorkers
 */
export const fixProjectOverAssignment = (projects, numberOfWorkers) => {
   let updatedProjects = projects;
   const unassignedWorkers = [];

   // nothing to do if there are no projects
   if (projects.length === 0) {
      return unassignedWorkers;
   }

   const workersPerProject = Math.floor(numberOfWorkers / projects.length);
   const workerRemainder = numberOfWorkers % projects.length;

   // remove excess workers from projects and push to unassigned workers pool
   projects.forEach((project, index) => {
      // Build up project allowance based on base workers per project and any overflow
      const numberOfWorkersAllowance = workersPerProject + (workerRemainder !== 0 && workerRemainder -1 <= index ? 1 : 0 );
      
      const currentNumberOfWorkers = project.workerIds.length;

      if ( currentNumberOfWorkers > numberOfWorkersAllowance ) {
         const numberOfExcessWorkers = currentNumberOfWorkers - numberOfWorkersAllowance;
         unassignedWorkers = unassignedWorkers.concat(updatedProjects[index].workerIds.splice(-numberOfExcessWorkers, numberOfExcessWorkers));
      } else {
            // do nothing
      }
   });

   // Update master copy of projects
   Object.assign(projects, updatedProjects)

   return unassignedWorkers;
}

/**
 * 
 * @param { Project[]} projects 
 * @param {number} numberOfWorkers
 * @param {string[]} unassignedWorkers
 * 
 */
 export const taskUnassignedWorkers = (projects, numberOfWorkers, unassignedWorkers) => {
   // nothing to do if there are no projects
   if (projects.length) {
      let updatedProjects = projects;
      const workersPerProject = Math.floor(numberOfWorkers / projects.length);
      const workerRemainder = numberOfWorkers % projects.length;

      // push to unassigned workers to project space
      projects.forEach((project, index) => {
         // Build up project allowance based on base workers per project and any overflow
         const numberOfWorkersAllowance = workersPerProject + (workerRemainder !== 0 && workerRemainder -1 <= index ? 1 : 0 );
         
         const currentNumberOfWorkers = project.workerIds.length;

         if ( currentNumberOfWorkers < numberOfWorkersAllowance ) {
            const numberOfSpareSlots =  numberOfWorkersAllowance - currentNumberOfWorkers;
            const projectNewWorkers = unassignedWorkers.splice(-numberOfSpareSlots, numberOfSpareSlots);
            
            // update workers project
            projectNewWorkers.forEach((workerId) => {
                Game.creeps[workerId].memory.project = project;
            })
            
            // update project record
            updatedProjects[index].workerIds = project.workerIds.concat(projectNewWorkers);
         } else {
               // do nothing
         }
      });
      
      // Update master copy of projects
      Object.assign(projects, updatedProjects)
   }

}