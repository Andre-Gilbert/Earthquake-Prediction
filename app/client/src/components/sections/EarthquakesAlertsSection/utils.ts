import { Colors } from '@blueprintjs/core';

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
