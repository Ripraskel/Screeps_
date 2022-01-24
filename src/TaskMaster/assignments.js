import { fixProjectOverAssignment, taskUnassignedWorkers } from './skills';

/**
 * 
 * @param {Room} room 
 */
export const manageWorkers = (room) => {
    // find already idle workers
    const allWorkers = [];
    let idleWorkers = [];
    for(const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === 'worker') {
            allWorkers.push(name);
            if(!creep.memory.project.assignmentType) {
                idleWorkers.push(name);
            }
        }
    };

    // get stored projects from memory
    const storeProjects = room.memory.projects ? room.memory.projects : []; 

    // remove workers from overassigned projects
    // add freed up worker to idleWorkers list
    idleWorkers = idleWorkers.concat(fixProjectOverAssignment(storeProjects, allWorkers.length));

    taskUnassignedWorkers(storeProjects, allWorkers.length, idleWorkers);

    // update room memory
    room.memory.projects = storeProjects;
}