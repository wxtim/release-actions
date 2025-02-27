/* THIS FILE IS PART OF THE CYLC SUITE ENGINE.
Copyright (C) NIWA & British Crown (Met Office) & Contributors.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>. */

// Helpers for NodeJS steps in GitHub Actions

const {env} = process;
const {execSync} = require('child_process');
const execSyncOpts = {stdio: 'pipe', encoding: 'utf8'};
const {writeFileSync} = require('fs');

exports.curlOpts = '--silent --fail --show-error';

/** Escape single quotes in string */
exports.escSQ = (str) => {
    return str.replace(/'/g, "&apos;")
}

/**
 * Node's execSync() but with improved logging
 *
 * @param {string} cmd - The command to execute.
 * @param {{ quiet: boolean, verbose: boolean }} options
 * @return {string} - stdout
 */
exports.execSync = (cmd, options = {}) => {
    let stdout;
    try {
        stdout = execSync(cmd, execSyncOpts);
    } catch (err) {
        console.log(`::error:: ${err.stderr ? err.stderr : 'Error executing command'}`);
        throw err.message;
    }
    if (!options.quiet) {
        if (!options.verbose) {
            console.log(`::group::exec ${cmd.slice(0, 60)}...`);
        }
        console.log(`[command]${cmd}`);
        try {
            console.log(JSON.stringify(JSON.parse(stdout), null, 2));
        } catch {
            console.log(stdout);
        }
        if (!options.verbose) {
            console.log('::endgroup::');
        }
    }
    return stdout;
};

/** Set an environment variable for later steps in a workflow to use */
exports.setEnv = (name, value) => {
    writeFileSync(env.GITHUB_ENV, `${name}=${value}\n`, {flag: 'a'})
};

/** Set a step's output */
exports.setOutput = (name, value) => {
    writeFileSync(env.GITHUB_OUTPUT, `${name}=${value}\n`, {flag: 'a'})
};

/** Add a path to $PATH */
exports.addPath = (path) => {
    writeFileSync(env.GITHUB_PATH, `${path}\n`, {flag: 'a'})
};
