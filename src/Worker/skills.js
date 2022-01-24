export const harvest = (creep, energySource, energyContainer) => {
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

export const build = (creep, energySource, constructionSite) => {
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

export const upgrade = (creep, energySource) => {
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

export const repair = (creep, energySource, damagedStructure) => {
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
