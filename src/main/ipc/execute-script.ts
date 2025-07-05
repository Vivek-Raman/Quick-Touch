import { spawn } from 'child_process';
import { ipcMain } from 'electron';
import { IpcMainInvokeEvent } from 'electron/main';

export default class ExecuteScript {
  constructor() {
    ipcMain.handle(
      'execute-script',
      (event: IpcMainInvokeEvent, script: string) => {
        const exec = script.split(' ');
        const child = spawn(exec[0], exec.slice(1), {
          shell: true,
        });

        child.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
          console.log(`Child process exited with code ${code}`);
        });

        return true;
      },
    );
  }
}
