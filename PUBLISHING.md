# Semantic Release

This monorepo uses semantic release. Some notes on this:

- `releaserc.json` contains all the semantic release configuration
- we think this will create some amount of dist tags by default on prerelease (e.g.
  `npm install @hsi/viz-components@beta`)
- we think it will also generate some release notes (maybe) and some git tags (maybe)

- beta release bot will need to be updated -- UPDATE: we will deprecate beta release bot
- TODO: package.json version number bump will not be committed -- add a badge to keep track of
  version number?
- TODO: move scripts to individual project package.json && overall scripts can do `--prefix`
- TODO: have meeting where we test out a bunch of this stuff
- TODO: add to ui-components too
