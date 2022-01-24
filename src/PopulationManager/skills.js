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
/**
 * Clears up the Memory of fallen creeps
 */
export const reapTheDead = () => {
    for(const name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}