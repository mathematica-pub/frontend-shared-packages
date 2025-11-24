#!/usr/bin/env bash
set -euo pipefail

# Usage: ./make-beta-branch.sh <lib-name>
# Example: ./make-beta-branch.sh ui

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <lib-name> (e.g. $0 ui)"
  exit 1
fi

PACKAGE_NAME="$1"

# 1. Make sure we're inside a git repo and go to repo root
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "Error: not inside a git repository."
  exit 1
fi
cd "${REPO_ROOT}"

# 2. Ensure clean working tree (no uncommitted changes)
if ! git diff-index --quiet HEAD --; then
  echo "Error: working tree is not clean. Commit or stash changes first."
  exit 1
fi

STARTING_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# 3. Build the lib
echo "Building lib '${PACKAGE_NAME}'..."
npx nx build "${PACKAGE_NAME}"

# 4. Figure out where Nx put the built artifacts
DIST_DIR="dist/${PACKAGE_NAME}"
if [[ ! -d "${DIST_DIR}" ]]; then
  echo "Error: expected build output directory '${DIST_DIR}' not found."
  exit 1
fi

# 5. Copy build output to a temp directory so we can switch branches safely
TMPDIR="$(mktemp -d)"
trap 'rm -rf "${TMPDIR}"' EXIT
cp -R "${DIST_DIR}/." "${TMPDIR}/"

# 6. Pick a unique beta branch name based on current branch + package
#    Convention: beta-releases/<STARTING_BRANCH>-<PACKAGE_NAME>[-N]
BASE_BETA_BRANCH="beta-releases/${STARTING_BRANCH}-${PACKAGE_NAME}"
BETA_BRANCH="${BASE_BETA_BRANCH}"
i=2
while git show-ref --quiet "refs/heads/${BETA_BRANCH}" || git show-ref --quiet "refs/remotes/origin/${BETA_BRANCH}"; do
  BETA_BRANCH="${BASE_BETA_BRANCH}-${i}"
  ((i++))
done

echo "Creating beta branch '${BETA_BRANCH}'..."

# 7. Create an orphan branch and wipe tree contents
git checkout --orphan "${BETA_BRANCH}"

# Remove all tracked files from index and working tree
git rm -rf . >/dev/null 2>&1 || true

# Remove top-level untracked files/dirs except .git, .angular, .nx
# (those caches can have locked files; we'll just ignore them instead of committing them)
find . \
  -mindepth 1 -maxdepth 1 \
  ! -name '.git' \
  ! -name '.angular' \
  ! -name '.nx' \
  -exec rm -rf {} + || true

# 8. Copy built artefacts into this branch root
cp -R "${TMPDIR}/." .

# 9. Ensure .angular and .nx are ignored in this throwaway branch
#    (so they don't get added even if they still exist)
{
  echo ".angular/"
  echo ".nx/"
} >> .gitignore

# 10. Commit them
git add .
git commit -m "Beta build of ${PACKAGE_NAME} from ${STARTING_BRANCH}"

# 11. Push to origin
git push -u origin "${BETA_BRANCH}"

# 12. Work out HTTPS URL for origin
REMOTE_URL="$(git config --get remote.origin.url)"

# Convert common SSH form (git@github.com:org/repo.git) → https
if [[ "${REMOTE_URL}" =~ ^git@github.com:(.+)/(.+)\.git$ ]]; then
  ORG="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
  HTTPS_URL="https://github.com/${ORG}/${REPO}.git"
elif [[ "${REMOTE_URL}" =~ ^https:// ]]; then
  HTTPS_URL="${REMOTE_URL}"
else
  echo "Warning: unrecognized remote URL format: ${REMOTE_URL}"
  echo "Using it as-is; you may need to tweak this manually."
  HTTPS_URL="${REMOTE_URL}"
fi

# 13. Print dependency snippet for package.json
echo
echo "Done!"
echo "You can now add this to your consuming app's package.json:"
echo
echo "  \"${PACKAGE_NAME}\": \"git+${HTTPS_URL}#${BETA_BRANCH}\""
echo
echo "Then run your package manager (npm/yarn/pnpm) to install it."
echo

# 14. Go back to original branch
git checkout "${STARTING_BRANCH}"
