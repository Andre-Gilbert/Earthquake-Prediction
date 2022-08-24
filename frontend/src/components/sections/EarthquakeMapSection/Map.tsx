import { UseQueryResult } from '@tanstack/react-query';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import styles from './EarthquakeMap.module.scss';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl.src,
    iconUrl: iconUrl.src,
    shadowUrl: shadowUrl.src,
    iconSize: [16],
    shadowSize: [16],
});

export type MapProps = {
    query: UseQueryResult<any, unknown>;
};

export const Map = ({ query }: MapProps) => {
    return (
        <MapContainer className={styles.map} center={[38.907132, -77.036546]} zoom={3} zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomleft" />
            {query.data?.features.map((earthquake: any) => (
                <Marker
                    key={earthquake.id}
                    position={[earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]]}
                >
                    <Popup>{earthquake.properties.place}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};
