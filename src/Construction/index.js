import Architect from "./Architect"

export const Construction = {
    /**
    * 
    * @param {Constants} constants 
    */
    run: (constants) => {
        const architect = new Architect(constants);
        architect.run();
    }
}