# run from root directory
runningVersion=$(node -v)
requiredVersion=$(cat ./.nvmrc)

# node -v prefixes version with a v
if [ "$requiredVersion" = "${runningVersion//v}" ]; then
    echo "Node version matches required version."
else
    echo "Running Node version ${runningVersion//v}. Must run Node version ${requiredVersion}."
    exit 1
fi