import { exec as execCb } from 'child_process';
import util from 'util';

const exec = util.promisify(execCb);
export default exec;
