# SLSG Web
This project contains SLSG web interface (based on https://github.com/wp777/stv-web using https://gist.github.com/0xjac/85097472043b697ab57ba1b1c7530274).

## UI development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

This mode is intended for UI development purposes only. **slsg-server** is not available in this mode and therefore no server-side computations are available.
## Build and full development server

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

In this mode **slsg-server** is available (it has to be started separately). Use `ng build --watch` to enable automatic rebuild on source code changes.

## Coding guidelines
1. Don't commit code that does not compile.
1. Commits must contain a short message that describes changes.
1. Commits should be reasonably small.
1. Always review changes before commiting. VS Code has a great diff viewer available under `Ctrl+Shift+G G` shortcut.
1. Don't commit dead code (commented out code, `if (false) {...}` etc.).
1. Use `const` instead of `let` whenever possible. Avoid `var`.
1. Naming: use CamelCase for classes and camelCase for variables/methods. Use English. Names should be descriptive. For example use variable name `firstRenderTimestampMs` rather than `t0`.
1. Indentation: use 4 spaces to keep the code readable. Keep current indentation in lines that contain no code.
1. Strings:
    * For single-line strings without embedded expressions use double quotation marks: `"`. Example:
        ```ts
        container.classList.add("withStateLabels"`);
        ```
    * For multi-line strings and template literals use backticks: `` ` ``. Examples:
        ```ts
        container.classList.add(`splitter-${orientation}`);
        const html = `
            <div>
                <slsg-example></slsg-example>
            </div>
        `;
        ```
1. Use semicolons.
1. Use spaces around operators. Bad example: `1/1.2`. Good example: `1 / 1.2`.
1. Always use braces and put returns in separate lines:
    ```ts
    if (...) {
        return;
    }
    ```
1. If-elseIf-else:
    ```ts
    if (...) {
        ...
    }
    else if (...) {
        ...
    }
    else {
        ...
    }
    ```
1. "Todo" comments:
    * `// @todo short description`
    * `// @todo XY short description` where `XY` should be replaced by initials of the person that is expected to address the issue.