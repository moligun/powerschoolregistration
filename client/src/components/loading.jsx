import React from 'react';
function Loading() {
    return (
        <div className="d-flex flex-column align-items-center">
            <strong>Loading...</strong>
            <div className="spinner-border" role="status"></div>
        </div>
    )
}
export default Loading
