/**
 * 
 * @returns { Constants }
 */
export const buildConstants = () => {
    const constants = {
        spawnGoal: {
            workers: 15 // calculate this in future?
        },
        room: Game.spawns['Spawn1'].room,
        spawnName: "Spawn1"
    }

    return constants;
}