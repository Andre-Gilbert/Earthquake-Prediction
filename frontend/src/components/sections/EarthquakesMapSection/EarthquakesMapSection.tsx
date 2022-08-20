import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import styles from './EarthquakesMap.module.scss';

export const EarthquakesMapSection = () => {
    return (
        <MapContainer className={styles.map} center={[38.907132, -77.036546]} zoom={10000}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[38.907132, -77.036546]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
};
