# run from root directory
# node -v prefixes version with a v
runningVersion="$(node -v)"
requiredVersion="v$(cat ./.nvmrc)"

if [ "$requiredVersion" = "$runningVersion" ]; then
    echo "Node version matches required version."
else
    echo "Running Node version $runningVersion. Must run Node version $requiredVersion."
    exit 1
fi