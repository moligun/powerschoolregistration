import React from 'react';
function Loading() {
    return (
        <div className="d-flex flex-column vh-100 align-items-center justify-content-center">
            <strong>Loading...</strong>
            <div className="spinner-border" role="status"></div>
        </div>
    )
}
export default Loading
