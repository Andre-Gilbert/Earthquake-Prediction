import { Button, Card, FormGroup, H5, Icon, Menu, MenuDivider, NumericInput } from '@blueprintjs/core';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import dynamic from 'next/dynamic';
import { FormEvent, useState } from 'react';
import styles from './EarthquakesMap.module.scss';
import { useEarthquakes } from './queries';

const Map = dynamic(() => import('@sections/EarthquakesMapSection/Map'), {
    ssr: false,
});

export const EarthquakesMapSection = () => {
    const [minLatitude, setMinLatitude] = useState(-90);
    const [maxLatitude, setMaxLatitude] = useState(90);
    const [minLongitude, setMinLongitude] = useState(-180);
    const [maxLongitude, setMaxLongitude] = useState(180);
    const [location, setLocation] = useState({
        minlatitude: minLatitude,
        maxlatitude: maxLatitude,
        minlongitude: minLongitude,
        maxlongitude: maxLongitude,
    });
    const earthquakesQuery = useEarthquakes(location);

    const handleMinLatitude = (valueAsNumber: number) => setMinLatitude(valueAsNumber);

    const handleMaxLatitude = (valueAsNumber: number) => setMaxLatitude(valueAsNumber);

    const handleMinLongitude = (valueAsNumber: number) => setMinLongitude(valueAsNumber);

    const handleMaxLongitude = (valueAsNumber: number) => setMaxLongitude(valueAsNumber);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLocation({
            minlatitude: minLatitude,
            maxlatitude: maxLatitude,
            minlongitude: minLongitude,
            maxlongitude: maxLongitude,
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

const Header = ({ ...props }: FilterProps) => {
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
            <MenuDivider title="Location" />
            <form onSubmit={handleSubmit}>
                <FormGroup
                    className={styles.input}
                    helperText="Decimal [-90, 90] degrees."
                    label="Min Latitude"
                    labelFor="min-latitude"
                >
                    <NumericInput
                        id="min-latitude"
                        defaultValue={minLatitude}
                        min={-90}
                        max={90}
                        fill
                        onValueChange={handleMinLatitude}
                    />
                </FormGroup>
                <FormGroup
                    className={styles.input}
                    helperText="Decimal [-90, 90] degrees."
                    label="Max Latitude"
                    labelFor="max-latitude"
                >
                    <NumericInput
                        id="max-latitude"
                        defaultValue={maxLatitude}
                        min={-90}
                        max={90}
                        fill
                        onValueChange={handleMaxLatitude}
                    />
                </FormGroup>
                <FormGroup
                    className={styles.input}
                    helperText="Decimal [-360, 360] degrees."
                    label="Min Longitude"
                    labelFor="min-longitude"
                >
                    <NumericInput
                        id="min-longitude"
                        defaultValue={minLongitude}
                        min={-360}
                        max={360}
                        fill
                        onValueChange={handleMinLongitude}
                    />
                </FormGroup>
                <FormGroup
                    className={styles.input}
                    helperText="Decimal [-360, 360] degrees."
                    label="Max Longitude"
                    labelFor="max-longitude"
                >
                    <NumericInput
                        id="max-longitude"
                        defaultValue={maxLongitude}
                        min={-360}
                        max={360}
                        fill
                        onValueChange={handleMaxLongitude}
                    />
                </FormGroup>
                <div className={styles.btnForm}>
                    <Button className={Classes.POPOVER2_DISMISS} type="submit" text="Submit" intent="primary" fill />
                </div>
            </form>
        </Menu>
    );
};
