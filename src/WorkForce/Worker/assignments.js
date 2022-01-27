import { harvest, build, upgrade, repair } from "./skills";

export const worker_assignment_type = {
    HARVEST: 'HARVEST',
    BUILD: 'BUILD',
    UPGRADE: 'UPGRADE',
    REPAIR: 'REPAIR'
};
/**
 * 
 * @param {Creep} creep 
 */
export const doAssignment = (creep) => {
    const energySource = Game.getObjectById(creep.memory.project.energySourceId);
   switch (creep.memory.project.assignmentType) {
       case worker_assignment_type.HARVEST:
            harvest(creep, energySource,  Game.structures[creep.memory.project.taskDestinationId]);
            break;
        case worker_assignment_type.BUILD:
            build(creep, energySource,  Game.constructionSites[creep.memory.project.taskDestinationId]);
            break;
        case worker_assignment_type.UPGRADE:
            upgrade(creep, energySource);
            break;
        case worker_assignment_type.REPAIR:
            repair(creep, energySource,  Game.getObjectById(creep.memory.project.taskDestinationId));
            break;
        default:
            harvest(creep, energySource,  Game.structures[creep.memory.project.taskDestinationId]);
            break;
   }
};