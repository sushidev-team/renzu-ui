# Publishing

Releases are managed by Release Please. For a bot-created release PR, run the **CI** workflow manually on its release branch before merging; GitHub does not automatically start pull request workflows for PRs created with GITHUB_TOKEN. Merge the package changes first, then merge its generated release PR. CI builds and tests the versioned package and publishes it using npm trusted publishing with provenance.

The first publication uses the repository secret `NPM_TOKEN`, provisioned from the RENZU vault. It must have publish access to the `@renzu` scope. Configure the package's npm trusted publisher afterwards:

- GitHub organization: `sushidev-team`
- Repository: `renzu-ui`
- Workflow filename: `release.yml`
- Allowed action: direct `npm publish`

No long-lived npm token is needed for subsequent CI releases. See [npm's trusted publishing guide](https://docs.npmjs.com/trusted-publishers/).

If publishing fails after a tag was created, rerun **Release please and npm** with that exact `vX.Y.Z` tag in `publish_tag`. Only stable version tags already contained in `main` can be published. Published npm versions are immutable; do not move release tags.
