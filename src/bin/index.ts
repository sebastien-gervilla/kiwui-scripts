#!/usr/bin/env node

import { dev, start, build } from "../scripts";
import { Command } from "../types";

const COMMANDS: Command[] = ['dev', 'start', 'build'];

// Throws error instead of ignoring it.
process.on('unhandledRejection', error => {
    throw error;
});

(() => {
    const args = process.argv.slice(2);
    
    const command = args[0] as Command;

    switch (command) {
        case 'dev':
            dev();
            break;

        case 'start':
            start();
            break;

        case 'build':
            build();
            break;
    
        default:
            throw new Error(
                "Command doesn't exist."
            );
    }
})();