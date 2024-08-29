#!/usr/bin/env node

import { exec } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const excludedFilesPath = path.join(__dirname, "excludedFiles.json"); // __dirnameを使用
let excludedFiles: string[] = [];

try {
	const data = fs.readFileSync(excludedFilesPath, "utf8");
	const json = JSON.parse(data);
	excludedFiles = json.excludedFiles || [];
} catch (error) {
	console.error(`Error reading excluded files: ${(error as Error).message}`);
	process.exit(1);
}

const targetBranch = process.argv[2];
const baseBranch = process.argv[3] || "origin/main";
const useOriginPrefix = process.argv[4] !== "false";

if (!targetBranch) {
	console.error(
		"Usage: prdiff <target_branch> [base_branch] [use_origin_prefix]",
	);
	process.exit(1);
}

// targetBranch に origin/ を付けるかどうかを決定
const targetBranchWithPrefix = useOriginPrefix
	? `origin/${targetBranch}`
	: targetBranch;

// git fetchを実行して最新の状態を取得
exec("git fetch", (fetchError) => {
	if (fetchError) {
		console.error(`Error fetching latest changes: ${fetchError.message}`);
		return;
	}

	// merge-baseを使って共通の親コミットを取得
	exec(
		`git merge-base ${baseBranch} ${targetBranchWithPrefix}`,
		(baseError, baseCommit) => {
			if (baseError) {
				console.error(`Error finding merge base: ${baseError.message}`);
				return;
			}

			const excludeArgs = excludedFiles
				.map((file) => `':(exclude)${file}'`)
				.join(" ");

			// git diffコマンドを実行
			const command = `git diff ${baseCommit.trim()}...${targetBranchWithPrefix} -- ${excludeArgs}`;

			exec(command, (diffError, stdout, stderr) => {
				if (diffError) {
					console.error(`Error executing command: ${diffError.message}`);
					return;
				}
				if (stderr) {
					console.error(`Error: ${stderr}`);
					return;
				}
				// 結果を表示
				console.log(stdout);
			});
		},
	);
});
