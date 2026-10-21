# Publishing

This package is structured as a publishable npm package.

## Before publishing

1. Add your author information and repository URL to `package.json` if you want them shown on npm.
2. Confirm the package name is still available:
   ```bash
   npm view dsh-whale-daily-nonsense version
   ```
3. Run the package checks:
   ```bash
   npm pack --dry-run
   ```

## Publish to npm

```bash
npm login
npm publish --access public
```

## Verify the published package

```bash
npm view dsh-whale-daily-nonsense version
dsh plugin --profile desktop add dsh-whale-daily-nonsense@0.1.0
```

Restart DeepSeek Harness after installation.

## Submit to the community catalog

After the npm release, submit the package to the Awesome DSH Plugin catalog:

- https://github.com/awesome-dsh-plugin/awesome-dsh-plugin

Include the npm package name, repository URL, short description, category, and a compatible DSH version range.