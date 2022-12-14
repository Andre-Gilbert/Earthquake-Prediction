import { Button, Card, FormGroup, H5, Icon, Menu, MenuDivider, NumericInput } from '@blueprintjs/core';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import { MAX_DATE, MIN_DATE } from '@common/date';
import { showToast } from '@common/Toast';
import { usgsInstance } from '@config/axios';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { FormEvent, useState } from 'react';
import { z } from 'zod';
import styles from './EarthquakesMap.module.scss';

const Map = dynamic(() => import('./Map'), {
    ssr: false,
});

const MIN_LATITUDE = -90;
const MAX_LATITUDE = 90;
const MIN_LONGITUDE = -180;
const MAX_LONGITUDE = 180;

const queryParamsValidator = z.object({
    minlatitude: z.number().gte(-90),
    maxlatitude: z.number().lte(90),
    minlongitude: z.number().gte(-360),
    maxlongitude: z.number().lte(360),
    sumlongitude: z.number().lte(360),
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
    const handleMinLatitude = (newMinLatitude: number) => setMinLatitude(newMinLatitude);
    const handleMaxLatitude = (newMaxLatitude: number) => setMaxLatitude(newMaxLatitude);
    const handleMinLongitude = (newMinLongitude: number) => setMinLongitude(newMinLongitude);
    const handleMaxLongitude = (newMaxLongitude: number) => setMaxLongitude(newMaxLongitude);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsed = queryParamsValidator.safeParse({
            minlatitude: minLatitude > maxLatitude ? maxLatitude : minLatitude,
            maxlatitude: maxLatitude < minLatitude ? minLatitude : maxLatitude,
            minlongitude: minLongitude > maxLongitude ? maxLongitude : minLongitude,
            maxlongitude: maxLongitude < minLongitude ? minLongitude : maxLongitude,
            sumlongitude: Math.abs(minLongitude) + Math.abs(maxLongitude),
        });

        if (!parsed.success) {
            parsed.error.issues.map((error, index) =>
                setTimeout(() => showToast(error.path, error.message), 1000 * index),
            );
            handleMinLatitude(MIN_LATITUDE);
            handleMaxLatitude(MAX_LATITUDE);
            handleMinLongitude(MIN_LONGITUDE);
            handleMaxLongitude(MAX_LONGITUDE);
        } else {
            const { sumlongitude, ...data } = parsed.data;
            setQueryParams(data);
        }
    };

    return (
        <div className={styles.location}>
            <div className={styles.container}>
                <Card className={styles.card}>
                    <Header
                        handleSubmit={handleSubmit}
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
                            defaultValue={MIN_LATITUDE}
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
                            defaultValue={MAX_LATITUDE}
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
                            defaultValue={MIN_LONGITUDE}
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
                            defaultValue={MAX_LONGITUDE}
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

type QueryParams = Omit<z.infer<typeof queryParamsValidator>, 'sumlongitude'>;

export type Earthquakes = z.infer<typeof earthquakesValidator>;

export const earthquakesValidator = z.object({
    type: z.string(),
    metadata: z.object({
        generated: z.number(),
        url: z.string().url(),
        title: z.string(),
        api: z.string(),
        count: z.number().gte(0).lte(20000),
        limit: z.number().lte(20000),
        offset: z.number().gte(1),
        status: z.number(),
    }),
    bbox: z.number().array(),
    features: z
        .object({
            type: z.string(),
            properties: z.object({
                mag: z.number().nullable(),
                place: z.string().nullable(),
                time: z.number().nullable(),
                updated: z.number().nullable(),
                tz: z.number().nullable(),
                url: z.string().url().nullable(),
                detail: z.string().nullable(),
                felt: z.number().nullable(),
                cdi: z.number().nullable(),
                mmi: z.number().nullable(),
                alert: z.string().nullable(),
                status: z.string().nullable(),
                tsunami: z.number().nullable(),
                sig: z.number().nullable(),
                net: z.string().nullable(),
                code: z.string().nullable(),
                ids: z.string().nullable(),
                sources: z.string().nullable(),
                types: z.string().nullable(),
                nst: z.number().nullable(),
                dmin: z.number().nullable(),
                rms: z.number().nullable(),
                gap: z.number().nullable(),
                magType: z.string().nullable(),
                type: z.string().nullable(),
            }),
            geometry: z.object({ type: z.string(), coordinates: z.number().array().length(3) }),
            id: z.string(),
        })
        .array(),
});

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
        .then(response => earthquakesValidator.parse(response.data));
};
