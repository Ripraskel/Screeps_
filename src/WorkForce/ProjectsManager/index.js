import { manageProjects } from './assignments';

export const ProjectsManager = {
    /**
    * 
    * @param {Constants} constants 
    */
    run: (constants) => {
        manageProjects(constants.room);
    }
}