import React from 'react';
import EventItem from '../EventsList/EventItem/EventItem';
import './EventsList.css';

const EventsList = props => {

 return <ul className="events__list">
        {props.events.map(event => {
     return   <EventItem key={event._id} eventTitle={event.title} eventPrice={event.price} eventDate={event.date} eventId={event._id} authUserId={props.authUserId} eventCreatorId={event.creator._id} onDetail={props.onViewDetail}/>})
        }
    </ul> 

    };


export default EventsList;