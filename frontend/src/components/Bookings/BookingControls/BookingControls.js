import React from 'react';
import './BookingControls.css';

const BookingControls = props => {

    return (
        <div className="bookings-controls">
            <button className={props.activeOutputClass === 'list' ? 'active' : ''} onClick={props.changeOutputTypeHandler.bind(this, 'list')}>List</button>
            <button className={props.activeOutputClass === 'chart' ? 'active' : ''}onClick={props.changeOutputTypeHandler.bind(this, 'chart')}>Chart</button></div>)
}

export default BookingControls;