import { getAllActiveBuildProjects } from "./build.skills";
import { getAllActiveEnergyProjects } from "./energy.skills";
import { getAllActiveRepairProjects } from "./repair.skills";
import { addActiveProjectsToStorage, removeInactiveProjectsFromStorage } from "./skills";
import { getAllActiveUpgradeProjects } from "./upgrader.skills";

/**
 * @param {Room} room
 * @returns { Project[] }
 */
export const manageProjects = (room) => {
    // Build up list of active Projects
    const activeProjects = getAllActiveEnergyProjects(room).concat(getAllActiveBuildProjects(room), getAllActiveUpgradeProjects(room), getAllActiveRepairProjects(room));

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
    })

}