
import { Army } from "./Army";
import { buildConstants } from "./constants";
import { Construction } from "./Construction";

import { PopulationManager } from "./WorkForce/PopulationManager/index";
import { ProjectsManager } from "./WorkForce/ProjectsManager/index";
import { TaskMaster } from "./WorkForce/TaskMaster/index";
import { Workers } from "./WorkForce/Worker/index";


module.exports.loop = function () {

    const constants = buildConstants();

    Construction.run(constants);
    
    PopulationManager.run(constants);
    ProjectsManager.run(constants);
    TaskMaster.run(constants);
    Workers.run();
    
    Army.run(constants);
    

}