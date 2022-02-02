import { soldier } from './army.constants' ;

class General {
    #hitlist = [];
    /**
     * 
     * @param {Constants} constants 
     */
    constructor (constants) {
        this.room = constants.room;
        this.#hitlist = constants.room.memory.hitlist ? constants.room.memory.hitlist : [];
    }

    run = () => {
        const activeEnemyTargets = this.#findAllActiveEnemyTargets();

        const returningTroops = this.#updateHitList(activeEnemyTargets);

        this.#debriefReturningTroops(returningTroops);

        this.#deployTroops(this.#getTroopsInTheBarracks());

        this.room.memory.hitlist = this.#hitlist;
    }

    /**
     * 
     * @returns { Mission[] }
     */
    #findAllActiveEnemyTargets = () => {
        const targets = this.room.find(FIND_HOSTILE_CREEPS, {
            filter: function(object) {
                return object.getActiveBodyparts(ATTACK) == 0;
            }
        });

        return targets.map((target) => {
            const mission = {
                targetId: target.id,
                taskForce: []
            }
            return mission;
        })

    }
    /**
     * 
     * @param { Mission[] } activeEnemyTargets
     * @returns { string[]}
     */
    #updateHitList = (activeEnemyTargets) => {
        let updatedHitlist = [];
        let soldiersReturningFromBattle = [];
        this.#hitlist.forEach((hitlistEnemy) =>  {
            let enemyDead = false;

            for (let index = activeEnemyTargets.length - 1; i >= 0; i--) {
                if (activeEnemyTargets[index].id === hitlistEnemy.targetId) {
                    updatedHitlist.push(hitlistEnemy);
                    activeEnemyTargets.splice(index, 1);
                    enemyDead = true;
                }
            }

            if (enemyDead) {
                soldiersReturningFromBattle = soldiersReturningFromBattle.concat(hitlistEnemy.taskForce)
            }
        })

        // append any enemies remaining on the activeEnemyTargets list
        Object.assign(this.#hitlist, updatedHitlist.concat(activeEnemyTargets));

        return soldiersReturningFromBattle;
    }

    #debriefReturningTroops = (troops) => {
        troops.forEach((name) => {
            Game.creeps[name].memory.mission = {
                missionType: soldier.mission.guard
            };
        })
    }

    #getTroopsInTheBarracks = () => {
        let idleSoldiers = [];
        for(const name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role === soldier.role_name && Game.creeps[name].memory.mission.missionType !== soldier.mission.attack) {
                idleSoldiers.push(name);
            }
        };
    
        return idleSoldiers;
    }
    
    #deployTroops = (idleSoldiers) => {
        const totalNumberOfSoldiers = this.#getAllTroops().length;

        if (this.#hitlist.length) {
            const soldiersPerMission = Math.floor(totalNumberOfSoldiers / this.#hitlist.length);
            const soldiersRemainder = totalNumberOfSoldiers % this.#hitlist.length;
      
            // push to unassigned workers to project space
            this.#hitlist.forEach((mission, index) => {
               // Build up project allowance based on base workers per project and any overflow
               const missionAllowance = soldiersPerMission + (soldiersRemainder !== 0 && soldiersRemainder -1 >= index ? 1 : 0 );

               const currentTaskForceSize = mission.taskForce.length;

               if ( currentTaskForceSize < missionAllowance ) {
                  const numberOfSpareSlots =  missionAllowance - currentTaskForceSize;
                  const missionTaskForceRecruits = idleSoldiers.splice(-numberOfSpareSlots, numberOfSpareSlots);
                  
                  // update soldier mission
                  missionTaskForceRecruits.forEach((name) => {
                      Game.creeps[name].memory.mission = {
                          missionType: soldier.mission.attack,
                          targetId: mission.targetId
                      }
                  })
                  
                  // update mission record
                  mission.taskForce = mission.taskForce.concat(missionTaskForceRecruits);
               } else {
                     // do nothing
               }
            });
        }    
    }

    #getAllTroops = () => {
        let allSoldiers = [];
        for(const name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role === soldier.role_name) {
                allSoldiers.push(name);
            }
        };
        return allSoldiers;
    }

}

export default General;