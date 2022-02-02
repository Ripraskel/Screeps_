class Architect {

    /**
     * 
     * @param {Constants} constants 
     */
    constructor (constants) {
        this.room = constants.room;
        this.spawner = Game.spawns[constants.spawnName]
    }

    run = () => {
        this.#mapOutRoads();
        this.#layRoadPlans();
    }

    #mapOutRoads = () => {
        const energySources = this.room.find(FIND_SOURCES);
        let roadLocations = [];

        energySources.forEach((source) => {
            const pathForSpawner = this.room.findPath(source.pos, this.spawner.pos);
            const pathForController = this.room.findPath(source.pos, this.room.controller.pos)

            roadLocations = pathForSpawner.concat(pathForController);
        });
        
        this.room.memory.construction = {
            roads: roadLocations
        };
    }

    #layRoadPlans = () => {
        const roadLocations = this.room.memory.construction.roads;

        roadLocations.forEach(position => {
            if (this.room.getTerrain().get(position.x, position.y) !== TERRAIN_MASK_WALL) {
                this.room.createConstructionSite(position.x, position.y, STRUCTURE_ROAD);
            }
            
        })
    }


}

export default Architect;