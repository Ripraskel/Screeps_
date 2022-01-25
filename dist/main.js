'use strict';

/**
 * 
 * @returns { Constants }
 */
const buildConstants = () => {
    const constants = {
        spawnGoal: {
            workers: 10 // calculate this in future?
        },
        room: Game.spawns['Spawn1'].room,
        spawnName: "Spawn1"
    };

    return constants;
};

/**
 * 
 * @param { string} spawnName 
 * @returns 
 */
const spawnWorker = (spawnName) => {
    const body_parts = [WORK,CARRY,MOVE];
    const name = 'Worker' + Game.time;
    const role = 'worker';

    if (Game.spawns[spawnName].spawnCreep(body_parts, name, { memory: {role, project: {}} }) === 0) {
        return true;
    } else {
        return false;
    }
};
/**
 * Clears up the Memory of fallen creeps
 */
const reapTheDead = (room) => {
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
                });
            });
            
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
};

/**
 * 
 * @param {Constants} constants 
 */
const manageWorkerPopulation = (constants) => {
    const workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');

    if (workers.length < constants.spawnGoal.workers) {
        spawnWorker(constants.spawnName);
    }
};

const reaperDuties = (room) => {
    // FUTURE: extend assignment to kill unrequired creeps
    reapTheDead(room);
};

const PopulationManager = {
    /**
     * 
     * @param {Constants} constants 
     */
    run: (constants) => {
        manageWorkerPopulation(constants);
        reaperDuties(constants.room);
    }
};

/**
 * 
 * @param { [][] } paths 
 * @returns { number } index of shortest path / array
 */
 const getShortestPath = (paths) => {
    let distance = 0;
    let shortestPathIndex = 0;
 
    paths.forEach((path, index) => {
       if (index === 0) {
          distance = path.length;
       }
       if (path.length < distance) {
          shortestPathIndex = index;
       }
    });
 
    return shortestPathIndex;
 };

const harvest = (creep, energySource, energyContainer) => {
    if(creep.store.getFreeCapacity() > 0) {
        if(creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(energySource, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else {
        if(creep.transfer(energyContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(energyContainer, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};

const build = (creep, energySource, constructionSite) => {
    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.building = false;
        creep.say('⛏ harvest');
    }
    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
        creep.memory.building = true;
        creep.say('🔨 build');
    }
    
    if(!creep.memory.building) {
        if(creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(energySource, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else {
        if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};

const upgrade = (creep, energySource) => {
    if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.upgrading = false;
        creep.say('🔄 harvest');
    }
    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
        creep.memory.upgrading = true;
        creep.say('⚡ upgrade');
    }

    if(creep.memory.upgrading) {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    else {
        if(creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(energySource, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

const repair = (creep, energySource, damagedStructure) => {
    if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.repairing = false;
        creep.say('⛏ harvest');
    }
    if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
        creep.memory.repairing = true;
        creep.say('🛠 repair');
    }
    
    if(!creep.memory.repairing) {
        if(creep.harvest(energySource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(energySource, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    else {
        if(creep.repair(damagedStructure) == ERR_NOT_IN_RANGE) {
            creep.moveTo(damagedStructure, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};

const worker_assignment_type = {
    HARVEST: 'HARVEST',
    BUILD: 'BUILD',
    UPGRADE: 'UPGRADE',
    REPAIR: 'REPAIR'
};
/**
 * 
 * @param {Creep} creep 
 */
const doAssignment = (creep) => {
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
            repair(creep, energySource,  Game.structures[creep.memory.project.taskDestinationId]);
            break;
        default:
            harvest(creep, energySource,  Game.structures[creep.memory.project.taskDestinationId]);
            break;
   }
};

/**
 * 
 * @param {Room} room 
 * @returns { Project[] } Array of Build Projects
 */
 const getAllActiveBuildProjects = (room) => {
    const buildingSites = room.find(FIND_MY_CONSTRUCTION_SITES);
 
    const energySources = room.find(FIND_SOURCES_ACTIVE);
 
    const projects = buildingSites.map(buildingSite => { 
       const paths = energySources.map(source => {
          return room.findPath(source.pos, buildingSite.pos);
       });
       return {
          assignmentType: worker_assignment_type.BUILD,
          energySourceId: energySources[getShortestPath(paths)].id,
          taskDestinationId: buildingSite.id,
          workerIds: []
       };
    });
 
    return projects;
 };

/**
 * 
 * @param {Room} room 
 * @returns { Project[] } Array of Harvest Projects
 */
 const getAllActiveEnergyProjects = (room) => {
    const energyContainers = room.find(FIND_MY_STRUCTURES, {
       filter: (structure) => {
          return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION && 
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
       }
    });
 
    const energySources = room.find(FIND_SOURCES_ACTIVE);
 
    const projects = energyContainers.map(energyContainer => { 
       const paths = energySources.map(source => {
          return room.findPath(source.pos, energyContainer.pos);
       });
       return {
          assignmentType: worker_assignment_type.HARVEST,
          energySourceId: energySources[getShortestPath(paths)].id,
          taskDestinationId: energyContainer.id,
          workerIds: []
       };
    });
 
    return projects;
 };

/**
 * 
 * @param { Project[]} storedProjects
 * @param { Project[]} activeProjects 
 * 
 */
 const addActiveProjectsToStorage = (storedProjects, activeProjects) => {
    let updatedProjects = storedProjects;
    const newActiveProjects = [];

    activeProjects.forEach((activeProject) => {
       let newProject = true;
 
       // check if project already stored
       storedProjects.forEach((storedProject, index) => {
          if (activeProject.taskDestinationId === storedProject.taskDestinationId &&
              activeProject.assignmentType === storedProject.assignmentType) {
             newProject = false;
          }
       });
 
       // Add new project to list
       if (newProject) {
            newActiveProjects.push(activeProject);
       }
    });
 
    updatedProjects = updatedProjects.concat(newActiveProjects);

    // update stored projects
    Object.assign(storedProjects, updatedProjects);
 };

 /**
 * 
 * @param { Project[]} storedProjects
 * @param { Project[]} activeProjects 
 * 
 * @returns { string[]} Workers on removed projects
 * 
 * Removes the inactive projects from the storedProjects passed in be reference
 */
const removeInactiveProjectsFromStorage = (storedProjects, activeProjects) => {
    let updatedProjects = storedProjects;
    let toBeRemovedProjectIndices = [];
    let workersOnRemovedProjects = [];

    storedProjects.forEach((storedProject, storedProjectIndex) => {
        let projectStillActive = false;
        // check if project still active
        activeProjects.forEach((activeProject) => {
            if (activeProject.taskDestinationId === storedProject.taskDestinationId &&
                activeProject.assignmentType === storedProject.assignmentType) {
                projectStillActive = true;
            }
        });

        if (!projectStillActive) {
            toBeRemovedProjectIndices.push(storedProjectIndex);
        }
    });

    // Use reverse as to not affect index positions when splicing
    toBeRemovedProjectIndices.reverse().forEach(index => {
        // Add workers on to be deleted project to list
        workersOnRemovedProjects = workersOnRemovedProjects.concat(storedProjects[index].workerIds);

        // Remove the project from storeProjects
        updatedProjects.splice(index, 1);
    });

    // Update master copy of storedProjects
    Object.assign(storedProjects, updatedProjects);

    return workersOnRemovedProjects;
};

/**
* 
* @param {Room} room 
* @returns { Project[] } Array of Upgrade Projects
*/
const getAllActiveUpgradeProjects = (room) => {
   if (room.controller) {
      const energySources = room.find(FIND_SOURCES_ACTIVE);
 
      const paths = energySources.map(source => {
         return room.findPath(source.pos, room.controller.pos);
      });

      return [{
         assignmentType: worker_assignment_type.UPGRADE,
         energySourceId: energySources[getShortestPath(paths)].id,
         taskDestinationId: null,
         workerIds: []
      }];
 
   } else {
      return []
   }
 };

/**
 * @param {Room} room
 * @returns { Project[] }
 */
const manageProjects = (room) => {
    // Build up list of active Projects
    const activeProjects = getAllActiveEnergyProjects(room).concat(getAllActiveBuildProjects(room), getAllActiveUpgradeProjects(room));

    // Get stored projects in memory
    const storedProjects = room.memory.projects ? room.memory.projects : [];

    // Remove inactive projects from storage and keep track of workers affected
    const workersOnRemovedProjects = removeInactiveProjectsFromStorage(storedProjects,  activeProjects);

    // Add new active projects to the stored projects
    addActiveProjectsToStorage(storedProjects,  activeProjects);

    // Update room memory
    room.memory.projects = storedProjects;

    // Release workers from deleted projects
    workersOnRemovedProjects.forEach((id) => {
        Game.creeps[id].memory.project = {};
    });

};

const ProjectsManager = {
    /**
    * 
    * @param {Constants} constants 
    */
    run: (constants) => {
        manageProjects(constants.room);
    }
};

/**
 * 
 * @param { Project[]} projects 
 * @param {number} numberOfWorkers 
 * 
 * @returns {string[]} UnassignedWorkers
 */
const fixProjectOverAssignment = (projects, numberOfWorkers) => {
   let updatedProjects = projects;
   let unassignedWorkers = [];

   // nothing to do if there are no projects
   if (projects.length === 0) {
      return unassignedWorkers;
   }

   const workersPerProject = Math.floor(numberOfWorkers / projects.length);
   const workerRemainder = numberOfWorkers % projects.length;

   // remove excess workers from projects and push to unassigned workers pool
   projects.forEach((project, index) => {
      // Build up project allowance based on base workers per project and any overflow
      const numberOfWorkersAllowance = workersPerProject + (workerRemainder !== 0 && workerRemainder -1 <= index ? 1 : 0 );
      
      const currentNumberOfWorkers = project.workerIds.length;

      if ( currentNumberOfWorkers > numberOfWorkersAllowance ) {
         const numberOfExcessWorkers = currentNumberOfWorkers - numberOfWorkersAllowance;

         const releasedWorkers = updatedProjects[index].workerIds.splice(-numberOfExcessWorkers, numberOfExcessWorkers);

         // update workers project
         releasedWorkers.forEach((workerId) => {
            Game.creeps[workerId].memory.project = {};
         });

         unassignedWorkers = unassignedWorkers.concat(releasedWorkers);
      }
   });

   // Update master copy of projects
   Object.assign(projects, updatedProjects);

   return unassignedWorkers;
};

/**
 * 
 * @param { Project[]} projects 
 * @param {number} numberOfWorkers
 * @param {string[]} unassignedWorkers
 * 
 */
 const taskUnassignedWorkers = (projects, numberOfWorkers, unassignedWorkers) => {
   // nothing to do if there are no projects
   if (projects.length) {
      let updatedProjects = projects;
      const workersPerProject = Math.floor(numberOfWorkers / projects.length);
      const workerRemainder = numberOfWorkers % projects.length;

      // push to unassigned workers to project space
      projects.forEach((project, index) => {
         // Build up project allowance based on base workers per project and any overflow
         const numberOfWorkersAllowance = workersPerProject + (workerRemainder !== 0 && workerRemainder -1 <= index ? 1 : 0 );
         
         const currentNumberOfWorkers = project.workerIds.length;

         if ( currentNumberOfWorkers < numberOfWorkersAllowance ) {
            const numberOfSpareSlots =  numberOfWorkersAllowance - currentNumberOfWorkers;
            const projectNewWorkers = unassignedWorkers.splice(-numberOfSpareSlots, numberOfSpareSlots);
            
            // update workers project
            projectNewWorkers.forEach((workerId) => {
                Game.creeps[workerId].memory.project = project;
            });
            
            // update project record
            updatedProjects[index].workerIds = project.workerIds.concat(projectNewWorkers);
         }
      });
      
      // Update master copy of projects
      Object.assign(projects, updatedProjects);
   }

};

/**
 * 
 * @param {Room} room 
 */
const manageWorkers = (room) => {
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
    }
    // get stored projects from memory
    const storeProjects = room.memory.projects ? room.memory.projects : []; 

    // remove workers from overassigned projects
    // add freed up worker to idleWorkers list
    idleWorkers = idleWorkers.concat(fixProjectOverAssignment(storeProjects, allWorkers.length));

    taskUnassignedWorkers(storeProjects, allWorkers.length, idleWorkers);

    // update room memory
    room.memory.projects = storeProjects;
};

const TaskMaster = {
    /**
    * 
    * @param {Constants} constants 
    */
    run: (constants) => {
        manageWorkers(constants.room);
    }
};

const Workers = {
    run: () => {
        // execute work
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role === 'worker' && creep.memory.project.assignmentType) {
                doAssignment(creep);
            }
        }
    }
};

module.exports.loop = function () {

    const constants = buildConstants();

    PopulationManager.run(constants);
    ProjectsManager.run(constants);
    TaskMaster.run(constants);
    Workers.run();

};
//# sourceMappingURL=main.js.map
