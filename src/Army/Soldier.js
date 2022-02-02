import { soldier } from './army.constants';

class Soldier {
    /**
     * 
     * @param {Constants} constants 
     */
    constructor () {
    }

    run = () => {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role === soldier.role_name) {
                switch (creep.memory.mission.missionType) {
                    case soldier.mission.attack: 
                        this.#attack(creep);
                    case soldier.mission.guard:
                        this.#guard(creep);
                    default:
                        this.#guard(creep);
                }
            }
        }
    }

    /**
     * 
     * @param {Creep} creep 
     */
    #attack = (creep) => {
        const target = Game.creeps[creep.memory.mission.targetId];

        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            creep.say('👣')
        } else {
            creep.say('⚔ attack!')
        }
    }

    #guard = (creep) => {
        creep.moveTo(3, 34);
        creep.say('🛡')
    }

}

export default Soldier;