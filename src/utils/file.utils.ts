import fs from 'fs';
import path from 'path';
import Color from '../helpers/Colors.helper';
import { Resolve } from '../types/path';

// Resolve file paths in the same order as webpack
export const resolveModule = (resolve: Resolve, filePath: string) => {
    const extension = MODULE_EXTENSIONS.find(extension =>
        fs.existsSync(resolve(`${filePath}.${extension}`))
    );
  
    if (extension)
        return resolve(`${filePath}.${extension}`);
  
    return resolve(`${filePath}.js`);
};

export const checkRequiredFiles = (files: string[]) => {
    if (!files.length) return true;

    let currentFilePath!: string;

    try {
        for (const file of files) {
            currentFilePath = file;
            fs.accessSync(file, fs.constants.F_OK);
        }

        return true;
    } catch (error) {
        const dirName = path.dirname(currentFilePath);
        const fileName = path.basename(currentFilePath);

        console.log(Color.red('Could not find a required file.'));
        console.log(Color.red('  Name: ') + Color.cyan(fileName));
        console.log(Color.red('  Searched in: ') + Color.cyan(dirName));
        
        return false;
    }
}

// Module extensions
export const MODULE_EXTENSIONS = [
    'mjs',
    'js',
    'ts',
    'tsx',
    'json',
    'jsx',
];