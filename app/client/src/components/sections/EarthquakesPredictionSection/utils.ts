import { Classes } from '@blueprintjs/core';
import { Prediction } from './EarthquakesPredictionSection';

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

/** Filters data points with max distance of 156km to earthquake */
export function filterCloseCoordinates(entry: Prediction, latitude: number, longitude: number) {
    return Math.abs(entry.latitude - latitude) <= 0.01 && Math.abs(entry.longitude - longitude) <= 0.01;
}
