
import { Army } from "./Army";
import { buildConstants } from "./constants";

import { PopulationManager } from "./WorkForce/PopulationManager/index";
import { ProjectsManager } from "./WorkForce/ProjectsManager/index";
import { TaskMaster } from "./WorkForce/TaskMaster/index";
import { Workers } from "./WorkForce/Worker/index";


module.exports.loop = function () {

    const constants = buildConstants();

    PopulationManager.run(constants);
    ProjectsManager.run(constants);
    TaskMaster.run(constants);
    Workers.run();
    
    Army.run(constants);

}