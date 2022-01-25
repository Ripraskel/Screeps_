import { manageWorkerPopulation, reaperDuties } from "./assignments";

export const PopulationManager = {
    /**
     * 
     * @param {Constants} constants 
     */
    run: (constants) => {
        manageWorkerPopulation(constants);
        reaperDuties(constants.room);
    }
}