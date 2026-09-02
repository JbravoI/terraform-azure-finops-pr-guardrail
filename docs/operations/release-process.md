# Release Process

## Release prerequisites

- All local rows in `../testing/test-matrix.md` are passing.
- Required GitHub workflow rows have links to successful runs.
- A sample internal pull request demonstrates creation and update of the marker-based comment.
- A disposable or approved test environment validates the selected Infracost integration before it is advertised as live.
- Documentation, traceability map, changelog, and current status match the implementation.
- No credentials, plan files, state, customer data, or local planning documents are staged for release.

## Release checklist

1. Run the test suite and retain only redacted output.
2. Review `.gitignore` and the staged change list for sensitive files.
3. Update `CHANGELOG.md` and create final release notes from `docs/releases/v0.1.0.md`.
4. Update links in `docs/releases/sample-pr.md` with the real pull request and workflow runs.
5. Create the signed or annotated `v0.1.0` tag after review.
6. Publish the GitHub release and attach no Terraform plans, state files, credentials, or customer artifacts.
7. Run the consumer-repository smoke test against the tag, not the default branch.

## Rollback

If a release causes incorrect blocking or unsafe comment behaviour, disable the required status check first, revert the workflow or action version, and publish a corrective release. Do not delete release evidence; record the reason and replacement version in the changelog.
