import { doAssignment } from "./assignments";

export const Workers = {
    run: () => {
        // execute work
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role === 'worker' && creep.memory.project.assignmentType) {
                doAssignment(creep);
            }
        }
    }
}