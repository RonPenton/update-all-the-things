import * as fs from 'fs';
import * as exec from 'child_process';

const input = JSON.parse(fs.readFileSync("package.json", { encoding: "UTF8" })) as any;

type Dependencies = { [key: string]: string };

const dependencies = input.dependencies as Dependencies;
const devDependencies = input.devDependencies as Dependencies;

process(dependencies, false);
process(devDependencies, true);

async function process(dependencies: Dependencies, isdev: boolean) : Promise<void> {
    for (var property in dependencies) {
        if (dependencies.hasOwnProperty(property)) {
            await processDependency(property, isdev);
        }
    }
}

function processDependency(pack: string, isdev: boolean): Promise<void> {
    console.log("Updating " + pack + "...");
    const str = isdev ? "--save-dev" : "--save";
    return new Promise<void>((resolve, reject) => {
        exec.exec(`npm install ${pack}@latest ${str}`, (err, stdout, stderr) => {
            if(err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
