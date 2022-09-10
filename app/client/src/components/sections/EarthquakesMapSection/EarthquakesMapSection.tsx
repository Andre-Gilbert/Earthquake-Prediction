import { Button, Card, FormGroup, H5, Icon, Intent, Menu, MenuDivider, NumericInput, Toaster } from '@blueprintjs/core';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import { MAX_DATE, MIN_DATE } from '@common/date';
import { usgsInstance } from '@config/axios';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { FormEvent, useState } from 'react';
import { Earthquakes } from 'types/earthquakes';
import { z } from 'zod';
import styles from './EarthquakesMap.module.scss';

const Map = dynamic(() => import('@sections/EarthquakesMapSection/Map'), {
    ssr: false,
});

const toaster = typeof window !== 'undefined' ? Toaster.create() : null;

const MIN_LATITUDE = -90;
const MAX_LATITUDE = 90;
const MIN_LONGITUDE = -180;
const MAX_LONGITUDE = 180;

const queryParamsValidator = z.object({
    minlatitude: z.number().gte(-90),
    maxlatitude: z.number().lte(90),
    minlongitude: z.number().gte(-360),
    maxlongitude: z.number().lte(360),
});

export const EarthquakesMapSection = () => {
    const [minLatitude, setMinLatitude] = useState(MIN_LATITUDE);
    const [maxLatitude, setMaxLatitude] = useState(MAX_LATITUDE);
    const [minLongitude, setMinLongitude] = useState(MIN_LONGITUDE);
    const [maxLongitude, setMaxLongitude] = useState(MAX_LONGITUDE);
    const [queryParams, setQueryParams] = useState({
        minlatitude: minLatitude,
        maxlatitude: maxLatitude,
        minlongitude: minLongitude,
        maxlongitude: maxLongitude,
    });
    const earthquakesQuery = useEarthquakes(queryParams);

    const handleMinLatitude = (valueAsNumber: number) => setMinLatitude(valueAsNumber);

    const handleMaxLatitude = (valueAsNumber: number) => setMaxLatitude(valueAsNumber);

    const handleMinLongitude = (valueAsNumber: number) => setMinLongitude(valueAsNumber);

    const handleMaxLongitude = (valueAsNumber: number) => setMaxLongitude(valueAsNumber);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsed = queryParamsValidator.safeParse({
            minlatitude: minLatitude,
            maxlatitude: maxLatitude,
            minlongitude: minLongitude,
            maxlongitude: maxLongitude,
        });

        if (!parsed.success) {
            parsed.error.issues.map((error, index) => setTimeout(() => showToast(error), 1000 * index));
            setQueryParams({
                minlatitude: MIN_LATITUDE,
                maxlatitude: MAX_LATITUDE,
                minlongitude: MIN_LONGITUDE,
                maxlongitude: MAX_LONGITUDE,
            });
        } else {
            setQueryParams(parsed.data);
        }
    };

    const showToast = (error: z.ZodIssue) => {
        toaster?.show({
            message: (
                <>
                    <b>{error.path}</b>: {error.message}
                </>
            ),
            intent: Intent.DANGER,
            timeout: 10000,
        });
    };

    return (
        <div className={styles.location}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <Header
                        handleSubmit={handleSubmit}
                        minLatitude={minLatitude}
                        maxLatitude={maxLatitude}
                        minLongitude={minLongitude}
                        maxLongitude={maxLongitude}
                        handleMinLatitude={handleMinLatitude}
                        handleMaxLatitude={handleMaxLatitude}
                        handleMinLongitude={handleMinLongitude}
                        handleMaxLongitude={handleMaxLongitude}
                    />
                    <Map query={earthquakesQuery} />
                </Card>
            </div>
        </div>
    );
};

type FilterProps = {
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    minLatitude: number;
    maxLatitude: number;
    minLongitude: number;
    maxLongitude: number;
    handleMinLatitude: (valueAsNumber: number) => void;
    handleMaxLatitude: (valueAsNumber: number) => void;
    handleMinLongitude: (valueAsNumber: number) => void;
    handleMaxLongitude: (valueAsNumber: number) => void;
};

const Header = (props: FilterProps) => {
    return (
        <div className={styles.header}>
            <div className={styles.mapTitle}>
                <Icon icon="map-marker" />
                <H5>Location</H5>
            </div>
            <Popover2 content={<FilterMenu {...props} />} placement="bottom-end">
                <Button type="button" icon="filter" minimal />
            </Popover2>
        </div>
    );
};

const FilterMenu = ({
    handleSubmit,
    minLatitude,
    maxLatitude,
    minLongitude,
    maxLongitude,
    handleMinLatitude,
    handleMaxLatitude,
    handleMinLongitude,
    handleMaxLongitude,
}: FilterProps) => {
    return (
        <Menu>
            <form onSubmit={handleSubmit}>
                <MenuDivider title="Location" />
                <div className={styles.flex}>
                    <FormGroup
                        className={styles.input}
                        label="Min Latitude"
                        helperText=">= -90 degrees"
                        labelFor="min-latitude"
                    >
                        <NumericInput
                            id="min-latitude"
                            defaultValue={minLatitude}
                            min={-90}
                            max={90}
                            fill
                            buttonPosition="none"
                            onValueChange={handleMinLatitude}
                        />
                    </FormGroup>
                    <FormGroup
                        className={styles.input}
                        label="Max Latitude"
                        helperText="<= 90 degrees"
                        labelFor="max-latitude"
                    >
                        <NumericInput
                            id="max-latitude"
                            defaultValue={maxLatitude}
                            min={-90}
                            max={90}
                            fill
                            buttonPosition="none"
                            onValueChange={handleMaxLatitude}
                        />
                    </FormGroup>
                </div>
                <div className={styles.flex}>
                    <FormGroup
                        className={styles.input}
                        helperText=">= -360 degrees"
                        label="Min Longitude"
                        labelFor="min-longitude"
                    >
                        <NumericInput
                            id="min-longitude"
                            defaultValue={minLongitude}
                            min={-360}
                            max={360}
                            fill
                            buttonPosition="none"
                            onValueChange={handleMinLongitude}
                        />
                    </FormGroup>
                    <FormGroup
                        className={styles.input}
                        helperText="<= 360 degrees"
                        label="Max Longitude"
                        labelFor="max-longitude"
                    >
                        <NumericInput
                            id="max-longitude"
                            defaultValue={maxLongitude}
                            min={-360}
                            max={360}
                            fill
                            buttonPosition="none"
                            onValueChange={handleMaxLongitude}
                        />
                    </FormGroup>
                </div>
                <div className={styles.btnForm}>
                    <Button className={Classes.POPOVER2_DISMISS} type="submit" text="Submit" intent="primary" fill />
                </div>
            </form>
        </Menu>
    );
};

type QueryParams = z.infer<typeof queryParamsValidator>;

const useEarthquakes = (queryParams: QueryParams) => {
    return useQuery<Earthquakes, Error>(['earthquakes-map', queryParams], () => fetchEarthquakes(queryParams));
};

const fetchEarthquakes = async (queryParams: QueryParams): Promise<Earthquakes> => {
    return await usgsInstance
        .get('query', {
            params: {
                format: 'geojson',
                starttime: MIN_DATE,
                endtime: MAX_DATE,
                eventtype: 'earthquake',
                limit: 1000,
                ...queryParams,
            },
        })
        .then(response => response.data);
};
