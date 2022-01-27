import Recruiter from './Recruiter';
import General from './General';
import Soldier from './Soldier';

export const Army = {
    /**
    * 
    * @param {Constants} constants 
    */
    run: (constants) => {
        const recruiter = new Recruiter(constants);
        recruiter.run();

        const general = new General(constants);
        general.run();

        const soldier = new Soldier();
        soldier.run();

    }
}