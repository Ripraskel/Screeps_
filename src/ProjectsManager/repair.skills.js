import {getShortestPath} from '../Utils/pathHelper';
import { worker_assignment_type } from '../Worker/assignments';

/**
 * 
 * @param {Room} room 
 * @returns { Project[] } Array of Repair Projects
 */
 export const getAllActiveRepairProjects = (room) => {
   const repairSites = room.find(FIND_STRUCTURES, {
      filter: (structure) => {
         switch (structure.structureType) {
            case STRUCTURE_WALL:
               return structure.hits/structure.hitsMax < 0.0001;
            default:
               return structure.hits < structure.hitsMax;
         }
      }
   });
 
    const energySources = room.find(FIND_SOURCES_ACTIVE);
 
    const projects = repairSites.map(repairSite => { 
       const paths = energySources.map(source => {
          return room.findPath(source.pos, repairSite.pos);
       })
       return {
          assignmentType: worker_assignment_type.REPAIR,
          energySourceId: energySources[getShortestPath(paths)].id,
          taskDestinationId: repairSite.id,
          workerIds: []
       };
    });
 
    return projects;
 }