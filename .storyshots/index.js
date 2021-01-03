import initStoryshots, {renderOnly} from '@storybook/addon-storyshots';


// this runs Jest snapshots on everything covered by Storybook/Happo
// it doesn't save those snapshots but the act of generating them adds to our code coverage report
// it's computationally wasteful but it's the best that exists right now: https://dev.to/penx/combining-storybook-cypress-and-jest-code-coverage-4pa5
initStoryshots({test: renderOnly});
