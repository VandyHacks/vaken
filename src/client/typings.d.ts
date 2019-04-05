// This file allows us to use import images into a .ts/x file to bundle with webpack.
// See: https://webpack.js.org/guides/typescript/#importing-other-assets
// Also: https://github.com/Microsoft/TypeScript-React-Starter/issues/12
// And finally: https://medium.com/@amcdnl/react-typescript-%EF%B8%8F-647aa7d054a9

declare module '*.png';
declare module '*.jpg';
declare module '*.svg';
declare module 'react-selectable-fast';

// Copyright (c) 2019 Vanderbilt University
