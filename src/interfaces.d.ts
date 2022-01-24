/**
 * Project defines an energy source, where to take it when harvested and then what to do with it at the destination.
 */
interface Project {
    assignmentType: string
    energySourceId: string
    taskDestinationId: string
    workerIds: string[]
}

declare const Project: Project;

interface Constants {
    spawnGoal: {
        workers: number
    },
    room: Room,
    spawnName: string
}

declare const Constants: Constants;