#!/usr/bin/env node

import { build, start } from "../scripts";
import { Command } from "../types";

const COMMANDS: Command[] = ['start', 'build'];

// Throws error instead of ignoring it.
process.on('unhandledRejection', error => {
    throw error;
});

(() => {
    const args = process.argv.slice(2);
    
    const command = args[0] as Command;
    if (!COMMANDS.includes(command))
        throw new Error("Command doesn't exist.")

    switch (command) {
        case 'start':
            start();
            break;

        case 'build':
            build();
            break;
    
        default:
            break;
    }
})();