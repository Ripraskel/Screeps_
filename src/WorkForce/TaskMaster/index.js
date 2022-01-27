import { manageWorkers } from "./assignments";

export const TaskMaster = {
    /**
    * 
    * @param {Constants} constants 
    */
    run: (constants) => {
        manageWorkers(constants.room);
    }
}