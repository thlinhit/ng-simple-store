import 'jest-preset-angular';
import '@angular-extensions/pretty-html-log';

// Globals mocks
window.matchMedia =
    window.matchMedia ||
    (() => {
        return {
            matches: false,
            addListener: () => {},
            removeListener: () => {},
        } as unknown as MediaQueryList;
    });
