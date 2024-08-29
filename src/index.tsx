#!/usr/bin/env node

import { exec } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
	.usage("Usage: $0 <target_branch> [options]")
	.command("<target_branch>", "The branch you want to compare")
	.option("base", {
		alias: "b",
		default: "origin/main",
		describe: "Base branch to compare against",
		type: "string",
	})
	.option("use-origin-prefix", {
		alias: "u",
		default: true,
		describe: "Use origin prefix",
		type: "boolean",
	})
	.option("exclude-file", {
		alias: "e",
		describe: "Path to a custom JSON file for excluded files",
		type: "string",
	})
	.help().argv as {
	_: (string | number)[];
	base: string;
	"use-origin-prefix": boolean;
	"exclude-file"?: string;
};

const targetBranch = argv._[0] as string; // target_branch
const baseBranch = argv.base as string; // base branch
const useOriginPrefix = argv["use-origin-prefix"] as boolean; // use origin prefix
const customExcludedFilesPath = argv["exclude-file"] as string | undefined; // exclude file

if (!targetBranch) {
	console.error("Error: target_branch is required.");
	process.exit(1);
}
// 除外ファイルのリストを読み込む関数
const loadExcludedFiles = (customExcludedFilesPath?: string): string[] => {
	if (customExcludedFilesPath) {
		const customExcludedFiles = fs.readFileSync(
			customExcludedFilesPath,
			"utf8",
		);
		return JSON.parse(customExcludedFiles).excludedFiles || [];
	}

	const excludedFilesPath = path.join(__dirname, "excludedFiles.json");
	const defaultExcludedFiles = fs.readFileSync(excludedFilesPath, "utf8");
	return JSON.parse(defaultExcludedFiles).excludedFiles || [];
};

// targetBranch に origin/ を付けるかどうかを決定
const targetBranchWithPrefix = useOriginPrefix
	? `origin/${targetBranch}`
	: targetBranch;

// 除外ファイルのリストを取得
const excludedFiles = loadExcludedFiles(customExcludedFilesPath);
const excludeArgs = excludedFiles
	.map((file: string) => `':(exclude)${file}'`)
	.join(" ");

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
