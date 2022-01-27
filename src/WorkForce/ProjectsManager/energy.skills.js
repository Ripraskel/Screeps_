import {getShortestPath} from '../Utils/pathHelper';
import { worker_assignment_type } from '../Worker/assignments';

/**
 * 
 * @param {Room} room 
 * @returns { Project[] } Array of Harvest Projects
 */
 export const getAllActiveEnergyProjects = (room) => {
    const energyContainers = room.find(FIND_MY_STRUCTURES, {
       filter: (structure) => {
          return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION && 
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
       }
    });
 
    const energySources = room.find(FIND_SOURCES_ACTIVE);
 
    const projects = energyContainers.map(energyContainer => { 
       const paths = energySources.map(source => {
          return room.findPath(source.pos, energyContainer.pos);
       })
       return {
          assignmentType: worker_assignment_type.HARVEST,
          energySourceId: energySources[getShortestPath(paths)].id,
          taskDestinationId: energyContainer.id,
          workerIds: []
       };
    });
 
    return projects;
 }