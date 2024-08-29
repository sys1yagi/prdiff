# prdiff

`prdiff` is a CLI tool to get GitHub Pull Request diffs for Generative AI.


## Features

- View diffs between a target branch and a base branch (default is `origin/main`).
- Exclude specific files from the diff using a customizable configuration.

## Installation

You can install `prdiff` globally using npm:

```bash
npm install -g prdiff
```

## Usage

Run the command as follows:

```bash
prdiff <target_branch> [base_branch] [use_origin_prefix]
```

### Arguments

- `<target_branch>`: The branch you want to compare (required).
- `[base_branch]`: The base branch to compare against (optional). Defaults to `origin/main`.
- `[use_origin_prefix]`: Set to `true` or `false` to control whether to use the `origin/` prefix (optional). Defaults to `true`.

### Examples

1. To view the diff compared to `origin/main`:

   ```bash
   prdiff feature-branch
   ```

2. To view the diff without the `origin/` prefix:

   ```bash
   prdiff feature-branch origin/main false
   ```

## Excluded Files

You can specify files to exclude from the diff in the `excludedFiles.json` configuration file. By default, the following files are excluded:

- `node_modules/`
- `package-lock.json`
- `yarn.lock`
- `.env`
- `dist/`
- `build/`
- `*.log` and more.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributions

Bug reports, feature requests, and pull requests are welcome. Feel free to reach out!
```

Feel free to modify any sections as needed. Let me know if you need any more help!