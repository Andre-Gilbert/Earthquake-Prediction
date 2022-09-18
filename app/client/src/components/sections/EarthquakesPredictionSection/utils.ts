import { Classes } from '@blueprintjs/core';

export function addScrollbarStyle() {
    const width = getScrollbarWidth();
    const stylesheet = createStyleSheet();
    const NS = Classes.getClassNamespace();
    stylesheet.insertRule(`.${NS}-overlay-open { padding-right: ${width}px }`, 0);
}

function createStyleSheet() {
    const style = document.createElement('style');
    document.head.appendChild(style);
    return style.sheet as CSSStyleSheet;
}

function getScrollbarWidth() {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.overflow = 'scroll';

    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    return scrollbarWidth;
}
