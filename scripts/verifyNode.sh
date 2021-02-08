# run from root directory
# node -v prefixes version with a v
runningVersion="$(node -v)"
requiredVersion="v$(cat ./.nvmrc)"

if [[ $runningVersion  == $requiredVersion* ]]; then
    echo "Node version is semver-compliant with required version."
else
    echo "Running Node version $runningVersion. Must run Node version semver-compliant with $requiredVersion."
    exit 1
fi