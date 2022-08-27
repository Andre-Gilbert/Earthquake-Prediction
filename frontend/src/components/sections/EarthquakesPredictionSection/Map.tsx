import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import styles from './EarthquakesPrediction.module.scss';

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: iconRetinaUrl.src,
//     iconUrl: iconUrl.src,
//     shadowUrl: shadowUrl.src,
//     iconSize: [16],
//     shadowSize: [8],
// });

export const Map = () => {
    return (
        <MapContainer className={styles.map} center={[38.907132, -77.036546]} zoom={3} zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomleft" />
        </MapContainer>
    );
};
