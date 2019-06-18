import React from 'react'

const Notification = ({ show }) => {
    if (!show) {
        return null
    }

    return (
        <div style={{ color: 'red' }}>
            {show.toString()}
        </div>
    )
}

export default Notification