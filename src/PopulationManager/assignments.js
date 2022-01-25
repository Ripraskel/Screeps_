import { spawnWorker, reapTheDead } from "./skills";

/**
 * 
 * @param {Constants} constants 
 */
export const manageWorkerPopulation = (constants) => {
    const workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');

    if (workers.length < constants.spawnGoal.workers) {
        spawnWorker(constants.spawnName);
    } else {
        // do nothing
    }
}

export const reaperDuties = (room) => {
    // FUTURE: extend assignment to kill unrequired creeps
    reapTheDead(room);
}