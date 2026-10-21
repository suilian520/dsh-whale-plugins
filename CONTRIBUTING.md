# Contributing

Ideas, bug reports, and pull requests are welcome.

## Development checks

```bash
npm run check
npm run pack:dry
```

## Adding a plugin

1. Create a package under `packages/`.
2. Add `dsh.bundle.patch` and `dsh.client` metadata.
3. Include English and Chinese metadata in `locale/`.
4. Include an original icon and a README.
5. Run the checks before opening a pull request.