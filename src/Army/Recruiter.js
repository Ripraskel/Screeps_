import { soldier } from './army.constants';

class Recruiter {
    /**
     * 
     * @param {Constants} constants 
     */
    constructor (constants) {
        this.spawner = Game.spawns[constants.spawnName];
        this.room = constants.room;
    }


    run = () => {
        this.#recruitSoldiers(this.#getTroopNumbers());
        this.#reapTheDead();
    }

    #getTroopNumbers = () => {
        // logic here at some point
        return 6;
    }

    /**
     * 
     * @param {Constants} constants 
     */
    #recruitSoldiers = (numbers) => {
        const soldiers = _.filter(Game.creeps, (creep) => creep.memory.role == soldier.role_name);

        if (soldiers.length < numbers) {
            const body_parts = [ATTACK,ATTACK,MOVE, MOVE];
            const name = soldier.name_prefix + Game.time;
            const role = soldier.role_name;
            const mission = {
                missionType: soldier.mission.guard
            }
        
            this.spawner.spawnCreep(body_parts, name, { memory: {role, mission} });
        } else {
            // do nothing
        }
    }

    #reapTheDead = () => {
        for(const name in Memory.creeps) {
            if(!Game.creeps[name] && Memory.creeps[name].role === soldier.role_name) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }
}

export default Recruiter;