import React from 'react';
import './EventItem.css';

const EventItem = props => {
    return < li key={props.eventId} className="events__list-item">
        <div><h1>{props.eventTitle}</h1>
            <h2>price: {props.eventPrice} DT - {new Date(props.eventDate).toLocaleDateString()}</h2>
        </div>
        <div>
            {props.authUserId !== props.eventCreatorId ? <button className="btn" onClick={props.onDetail.bind(this,props.eventId)}>View details</button> :
                <p>You're the owner</p>}
        </div>

    </li>
}

export default EventItem;