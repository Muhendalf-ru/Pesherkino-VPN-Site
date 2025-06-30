import React from 'react';

const CosmicSpinner: React.FC = () => {
  return (
    <div className="cosmic-spinner-container">
      <div className="cosmic-spinner">
        <div className="spinner-orbit">
          <div className="spinner-planet"></div>
        </div>
        <div className="spinner-orbit">
          <div className="spinner-planet"></div>
        </div>
        <div className="spinner-orbit">
          <div className="spinner-planet"></div>
        </div>
        <div className="spinner-center">
          <div className="spinner-star"></div>
        </div>
      </div>
      <div className="spinner-text">
        <span className="text-line">Собираем контент</span>
        <span className="text-line">по всему космосу</span>
        <span className="text-line">ради вас</span>
      </div>
      <div className="spinner-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default CosmicSpinner;
