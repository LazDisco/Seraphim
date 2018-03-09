import fs from 'fs';
import winston from 'winston'
//Oringinal Source: https://gist.github.com/kethinov/6658166

export async function fsDir(dir, commands) {
    let files = fs.readdirSync(dir);
    // let jsfiles = files.filter(f => f.split(".").pop() === "js") // Only pick files that have .js at the end
    
    if (files.length <= 0) {
        winston.info("ERR: Missing command files.") // There are no command files, or no commands folder.
        return
    }
    commands = commands || [];
    
    files.forEach(function (file) {
        
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            commands = fsDir(dir + '/' + file, files);
        }
        else {
            var otherDir = dir.split("./build")
            commands.push(otherDir[1] + '/' + file);
            
        }
    });
    return commands;
};