# Publishing

This repository uses GitHub for source code and npm for distribution.

## 1. Create the GitHub repository

Create an empty public repository named `dsh-whale-plugins`, then set its URL locally:

```bash
git remote add origin https://github.com/suilian520/dsh-whale-plugins.git
git branch -M main
git push -u origin main
```

## 2. Add repository metadata

Add a `repository` field to both files under `packages/*/package.json`:

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/suilian520/dsh-whale-plugins.git",
  "directory": "packages/dsh-whale-slacking-timer"
}
```

You can also add an `author` field.

## 3. Log in to npm

```bash
npm login
npm whoami
```

## 4. Run checks

```bash
npm run check
npm run pack:dry
```

## 5. Publish both packages

```bash
npm publish --workspaces --access public
```

Verify:

```bash
npm view dsh-whale-slacking-timer version
npm view dsh-whale-daily-nonsense version
```

## 6. Create a GitHub Release

Tag the release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Attach these files to the GitHub Release if desired:

- `dsh-whale-slacking-timer-0.1.0.tgz`
- `dsh-whale-daily-nonsense-0.1.0.tgz`

## 7. Submit to the community catalog

Open a submission against:

- https://github.com/awesome-dsh-plugin/awesome-dsh-plugin

Include the GitHub repository, npm package names, descriptions, category, and compatibility range.

## Optional GitHub Actions publishing

`.github/workflows/publish.yml` publishes on version tags. It requires an npm automation token stored as the `NPM_TOKEN` repository secret.