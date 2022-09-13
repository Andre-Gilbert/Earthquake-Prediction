import { H1, Spinner, SpinnerSize } from '@blueprintjs/core';
import { ICON } from '@config/leaflet';
import { UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import { Earthquakes } from 'types/earthquakes';
import styles from './EarthquakesMap.module.scss';

export type MapProps = {
    query: UseQueryResult<Earthquakes, Error>;
};

const Map = ({ query }: MapProps) => {
    const markers = useMemo(
        () =>
            query.data?.features.map(earthquake => (
                <Marker
                    key={earthquake.id}
                    position={{
                        lat: earthquake.geometry.coordinates[1],
                        lng: earthquake.geometry.coordinates[0],
                        alt: earthquake.geometry.coordinates[2],
                    }}
                    icon={ICON}
                >
                    <Popup>
                        <div className={styles.mapMarkerTitle}>Place</div>
                        <div className={styles.mapMarkerText}>{earthquake.properties.place}</div>
                        <div className={styles.mapMarkerTitle}>Latitude</div>
                        <div className={styles.mapMarkerText}>{earthquake.geometry.coordinates[1]}</div>
                        <div className={styles.mapMarkerTitle}>Longitude</div>
                        <div className={styles.mapMarkerText}>{earthquake.geometry.coordinates[0]}</div>
                        <div className={styles.mapMarkerTitle}>Depth</div>
                        <div className={styles.mapMarkerText}>{earthquake.geometry.coordinates[2]}</div>
                        <div className={styles.mapMarkerTitle}>Magnitude</div>
                        <div className={styles.mapMarkerText}>{earthquake.properties.mag}</div>
                    </Popup>
                </Marker>
            )),
        [query.data],
    );

    if (query.isLoading) {
        return (
            <div className={styles.map}>
                <Spinner size={SpinnerSize.LARGE} />
            </div>
        );
    }

    if (query.isError) {
        return (
            <div className={styles.map}>
                <H1 className={styles.error}>{query.error.message}</H1>
            </div>
        );
    }

    return (
        <MapContainer className={styles.map} center={[38.907132, -77.036546]} zoom={5} zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomleft" />
            {markers}
        </MapContainer>
    );
};

export default Map;
