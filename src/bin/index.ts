#!/usr/bin/env node

import { start } from "../scripts";
import { Command } from "../types";

const COMMANDS: Command[] = ['start'];

(() => {
    const args = process.argv.slice(2);
    
    const command = args[0] as Command;
    if (!COMMANDS.includes(command))
        throw new Error("Command doesn't exist.")

    if (command === 'start')
        return start();
})();