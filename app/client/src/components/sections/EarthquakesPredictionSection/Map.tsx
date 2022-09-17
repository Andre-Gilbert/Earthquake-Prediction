import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import styles from './EarthquakesPrediction.module.scss';

const Map = () => {
    return (
        <MapContainer className={styles.map} center={[38.907132, -77.036546]} zoom={10} zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomleft" />
        </MapContainer>
    );
};

export default Map;
