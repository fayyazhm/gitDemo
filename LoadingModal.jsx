import React from 'react';
import './LoadingModal.css'; // Import the CSS for the modal

const LoadingModal = () => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="loader"></div>
                <p>Loading...</p>
            </div>
        </div>
    );
};

export default LoadingModal;
