# Semantic Release

This monorepo uses semantic release. Some notes on this:

- `releaserc.json` contains all the semantic release configuration
- we think this will create some amount of dist tags by default on prerelease (e.g.
  `npm install @hsi/viz-components@beta`)
- we think it will also generate some release notes (maybe) and some git tags (maybe)
