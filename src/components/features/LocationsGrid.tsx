import React from 'react';
import { motion } from 'framer-motion';

interface Location {
  name: string;
  ping: string;
  flag: string;
  hosts: string[];
}

interface LocationsGridProps {
  locations: Location[];
}

const LocationsGrid: React.FC<LocationsGridProps> = ({ locations }) => {
  return (
    <div className="locations-container">
      {locations.map((location, index) => (
        <motion.div
          key={location.name}
          className="location-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}>
          <div className="location-header">
            <img
              src={location.flag}
              alt={`${location.name} flag`}
              className="location-flag"
              width="32"
              height="24"
            />
            <h3>{location.name}</h3>
          </div>
          <p className="ping-value">Пинг: {location.ping}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default LocationsGrid;
