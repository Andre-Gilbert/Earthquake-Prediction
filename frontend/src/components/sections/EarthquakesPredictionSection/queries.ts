import { apiInstance } from '@config/axios';
import { useQuery } from '@tanstack/react-query';

export interface EarthquakesPrediction {
    predictions: Earthquake[];
}

interface Earthquake {
    time: string;
    latitude: number;
    longitude: number;
    depth: number;
    mag: number;
    magType: string;
    id: string;
    place: string;
    prediction: number;
}

export const useEarthquakesPrediction = () => {
    return useQuery<EarthquakesPrediction, Error>(['earthquakes-prediction'], () => fetchEarthquakesPrediction());
};

const fetchEarthquakesPrediction = async (): Promise<EarthquakesPrediction> => {
    return await apiInstance.post('api/v1/earthquakes/predict-magnitudes').then(response => response.data);
};
