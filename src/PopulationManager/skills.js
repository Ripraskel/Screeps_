/**
 * 
 * @param { string} spawnName 
 * @returns 
 */
export const spawnWorker = (spawnName) => {
    const body_parts = [WORK,CARRY,MOVE];
    const name = 'Worker' + Game.time;
    const role = 'worker';

    if (Game.spawns[spawnName].spawnCreep(body_parts, name, { memory: {role, project: {}} }) === 0) {
        return true;
    } else {
        return false;
    }
}

export const spawnSoldier = (spawnName) => {
    const body_parts = [ATTACK,ATTACK,MOVE, MOVE];
    const name = 'Soldier' + Game.time;
    const role = 'soldier';

    if (Game.spawns[spawnName].spawnCreep(body_parts, name, { memory: {role, project: {}} }) === 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * Clears up the Memory of fallen creeps
 */
export const reapTheDead = (room) => {
    for(const name in Memory.creeps) {
        if(!Game.creeps[name]) {
            let projects = room.memory.projects;
            projects.forEach((project, projIndex) => {
                let deadWorkerIndices = [];
                project.workerIds.forEach((workerId, deadIndex) => {
                    if (workerId === name) {
                        deadWorkerIndices.push(deadIndex);
                    }
                });
                deadWorkerIndices.reverse().forEach((deadIndex) =>  {
                    room.memory.projects[projIndex].workerIds.splice(deadIndex, 1);
                })
            });
            
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}