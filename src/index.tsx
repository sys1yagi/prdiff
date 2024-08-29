#!/usr/bin/env node

import { exec } from "child_process";

const targetBranch = process.argv[2];

if (!targetBranch) {
	console.error("Usage: prdiff <target_branch>");
	process.exit(1);
}
const excludedFiles = ["package-lock.json", ".env"];
const excludeArgs = excludedFiles.map((file) => `:(exclude)${file}`).join(" ");

// git diffコマンドを実行
const command = `git diff origin/main...origin/${targetBranch} -- ${excludeArgs}`;

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
