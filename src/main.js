
import { buildConstants } from "./constants";

import { PopulationManager } from "./PopulationManager/index";
import { ProjectsManager } from "./ProjectsManager";
import { TaskMaster } from "./TaskMaster";
import { Workers } from "./Worker";


module.exports.loop = function () {

    const constants = buildConstants();

    PopulationManager.run(constants);
    ProjectsManager.run(constants);
    TaskMaster.run(constants);
    Workers.run();

}