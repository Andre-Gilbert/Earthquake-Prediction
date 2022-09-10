import moment from 'moment';

export const MIN_DATE = moment().add(-30, 'days').toDate();
export const MAX_DATE = moment().toDate();
