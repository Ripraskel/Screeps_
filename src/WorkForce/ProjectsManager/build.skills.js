import {getShortestPath} from '../Utils/pathHelper';
import { worker_assignment_type } from '../Worker/assignments';

/**
 * 
 * @param {Room} room 
 * @returns { Project[] } Array of Build Projects
 */
 export const getAllActiveBuildProjects = (room) => {
    const buildingSites = room.find(FIND_MY_CONSTRUCTION_SITES);
 
    const energySources = room.find(FIND_SOURCES_ACTIVE);
 
    const projects = buildingSites.map(buildingSite => { 
       const paths = energySources.map(source => {
          return room.findPath(source.pos, buildingSite.pos);
       })
       return {
          assignmentType: worker_assignment_type.BUILD,
          energySourceId: energySources[getShortestPath(paths)].id,
          taskDestinationId: buildingSite.id,
          workerIds: []
       };
    });
 
    return projects;
 }