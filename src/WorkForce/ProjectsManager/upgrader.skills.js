import {getShortestPath} from '../Utils/pathHelper';
import { worker_assignment_type } from '../Worker/assignments';

/**
* 
* @param {Room} room 
* @returns { Project[] } Array of Upgrade Projects
*/
export const getAllActiveUpgradeProjects = (room) => {
   if (room.controller) {
      const energySources = room.find(FIND_SOURCES_ACTIVE);
 
      const paths = energySources.map(source => {
         return room.findPath(source.pos, room.controller.pos);
      })

      return [{
         assignmentType: worker_assignment_type.UPGRADE,
         energySourceId: energySources[getShortestPath(paths)].id,
         taskDestinationId: null,
         workerIds: []
      }];
 
   } else {
      return []
   }
 }