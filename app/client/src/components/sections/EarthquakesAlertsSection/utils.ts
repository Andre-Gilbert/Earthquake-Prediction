import { Colors } from '@blueprintjs/core';
import { getDate } from 'common/date';

export const getLastDate = (isChecked7Days: boolean) => {
    return isChecked7Days ? new Date(getDate(Date.now(), 7)) : new Date(getDate(Date.now(), 30));
};

export const filterDate = (time: number, lastDate: Date) => {
    return new Date(time) >= lastDate;
};

export const getColor = (alertLevel: string) => {
    switch (alertLevel) {
        case 'green':
            return Colors.GREEN3;
        case 'yellow':
            return '#FFE20B';
        case 'orange':
            return Colors.ORANGE3;
        case 'red':
            return Colors.RED3;
        default:
            return Colors.BLUE3;
    }
};

export const getAlertLevelTooltip = (alertLevel: string) => {
    switch (alertLevel.toLowerCase()) {
        case 'green':
            return 'No response needed';
        case 'yellow':
            return 'Local/Regional';
        case 'orange':
            return 'National';
        case 'red':
            return 'International';
        default:
            return 'No response needed';
    }
};

export const getMagnitudeTypeTooltip = (magnitudeType: string) => {
    switch (magnitudeType.toLowerCase()) {
        case 'mww':
            return { magnitudeRange: '~5.0 and larger', distanceRange: '1 - 90  degrees' };
        case 'mwc':
            return { magnitudeRange: '~5.5 and larger', distanceRange: '20 - 180  degrees' };
        case 'mwb':
            return { magnitudeRange: '~5.5 to ~7.0', distanceRange: '30 - 90  degrees' };
        case 'mwr':
            return { magnitudeRange: '~4.0 to ~6.5', distanceRange: '0 - 10  degrees' };
        case 'ms20' || 'ms':
            return { magnitudeRange: '~5.0 to ~8.5', distanceRange: '20 - 160  degrees' };
        case 'mb':
            return { magnitudeRange: '~4.0 to ~6.5', distanceRange: '15 - 100 degrees' };
        case 'mfa':
            return { magnitudeRange: 'any', distanceRange: 'any' };
        case 'ml':
            return { magnitudeRange: '~2.0 to ~6.5', distanceRange: '0 - 600 km' };
        case 'mb_lg' || 'mlg':
            return { magnitudeRange: '~3.5 to ~7.0', distanceRange: '150 – 1110 km (10 degrees)' };
        case 'md' || 'md':
            return { magnitudeRange: '~4 or smaller', distanceRange: '0 - 400 km' };
        case 'mi' || 'mwp':
            return { magnitudeRange: '~5.0 to ~8.0', distanceRange: 'all' };
        case 'me':
            return { magnitudeRange: '~3.5 and larger', distanceRange: 'all' };
        case 'mh':
            return { magnitudeRange: 'any', distanceRange: 'any' };
        case 'finite fault':
            return { magnitudeRange: '~7.0 and larger', distanceRange: '30 - 90 degrees' };
        case 'mint':
            return { magnitudeRange: 'any', distanceRange: 'any' };
        default:
            return { magnitudeRange: 'any', distanceRange: 'any' };
    }
};
