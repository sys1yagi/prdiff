#!/usr/bin/env node

import { exec } from "node:child_process";
import * as fs from "node:fs";

const targetBranch = process.argv[2];

if (!targetBranch) {
	console.error("Usage: prdiff <target_branch>");
	process.exit(1);
}

const baseBranch = process.argv[3] || "origin/main";
const useOriginPrefix = process.argv[4] !== "false";

const excludedFilesPath = "./excludedFiles.json";
let excludedFiles: string[] = [];
try {
	const data = fs.readFileSync(excludedFilesPath, "utf8");
	const json = JSON.parse(data);
	excludedFiles = json.excludedFiles || [];
} catch (error) {
	console.error(`Error reading excluded files: ${(error as Error).message}`);
	process.exit(1);
}

const excludeArgs = excludedFiles
	.map((file) => `':(exclude)${file}'`)
	.join(" ");

const targetBranchWithPrefix = useOriginPrefix
	? `origin/${targetBranch}`
	: targetBranch;

const command = `git diff ${baseBranch}...origin/${targetBranchWithPrefix} -- ${excludeArgs}`;

exec(command, (error, stdout, stderr) => {
	if (error) {
		console.error(`Error executing command: ${error.message}`);
		return;
	}
	if (stderr) {
		console.error(`Error: ${stderr}`);
		return;
	}
	// 結果を表示
	console.log(stdout);
});
