# prdiff

`prdiff` is a CLI tool to get GitHub Pull Request diffs for Generative AI.

## Features

- View diffs between a target branch and a base branch (default is `origin/main`).
- Exclude specific files from the diff using a customizable configuration.
- Specify a custom JSON file for excluded files using command-line options.

## Installation

You can install `prdiff` globally using npm:

```bash
npm install -g prdiff
```

## Usage

Run the command as follows:

```bash
prdiff <target_branch> [options]
```

### Arguments

- `<target_branch>`: The branch you want to compare (required).
- `--base <base_branch>` or `-b <base_branch>`: The base branch to compare against (optional). Defaults to `origin/main`.
- `--use-origin-prefix` or `-u`: Set to `true` or `false` to control whether to use the `origin/` prefix (optional). Defaults to `true`.
- `--exclude-file <path>` or `-e <path>`: Path to a custom JSON file for excluded files (optional).

### Examples

1. To view the diff compared to `origin/main`:

   ```bash
   prdiff feature-branch
   ```

2. To specify a base branch:

   ```bash
   prdiff feature-branch --base origin/develop
   ```

3. To not use the `origin/` prefix:

   ```bash
   prdiff feature-branch --use-origin-prefix false
   ```

4. To use a custom excluded files list:

   ```bash
   prdiff feature-branch --exclude-file /path/to/your/customExcludedFiles.json
   ```

5. To combine multiple options:

   ```bash
   prdiff feature-branch --base origin/develop --use-origin-prefix false --exclude-file /path/to/your/customExcludedFiles.json
   ```

## Excluded Files

You can specify files to exclude from the diff using the --exclude-file option, which allows you to provide a custom JSON file containing the list of excluded files. This option overrides the default exclusion settings.


By default, the following files are excluded:

```
"node_modules/",
"package-lock.json",
"yarn.lock",
"pnpm-lock.yaml",
".env",
"dist/",
"build/",
"vendor/",
"*.test.go",
"*.mod",
"*.sum",
"target/",
"*.class",
"*.jar",
"*.war",
"*.iml",
"*.gradle",
".gitignore",
"*.log"
```

Feel free to use the --exclude-file option to customize the list of excluded files.



## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributions

Bug reports, feature requests, and pull requests are welcome. Feel free to reach out!

