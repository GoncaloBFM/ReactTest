import React from 'react';

export function LoadingSpinner() {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            zIndex: 999999,
            backgroundColor: 'rgba(0,0,0,0.3)',
        }}>
            Loading...
        </div>
    );
}
