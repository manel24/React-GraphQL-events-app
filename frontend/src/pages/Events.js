import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventsList from '../components/Events/EventsList/EventsList';
import Spinner from '../components/Spinner/Spinner';
import './Events.css';

class EventsPage extends Component {
    state = { modalDisplay: false, events: [], bookedEvents: [], isLoading: false, selectedEvent: null }
    isActive = true;
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.descriptionElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();

    }
    componentDidMount() {
        this.fetchEvents();
    }

    componentWillUnmount() {
        this.isActive = false;
    }

    displayModal = () => { this.setState({ modalDisplay: true }) }
    closeModal = () => { this.setState({ modalDisplay: false }) }
    confirmCreateEvent = (context) => {
        this.setState({ isLoading: true })
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const description = this.descriptionElRef.current.value;
        const date = this.dateElRef.current.value;
        if (title.trim().length === 0 || price === 0 || date.trim().length === 0 || description.trim().length === 0) { return; }
        const event = { title, price, description, date }
        console.log(event);
        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput:
                { title: "${title}", description: "${description}", date : "${date}", price : ${price}}) {
                        title
                        price
                        description
                        date
            }

        }`
        };
        const token = this.context.token;
        fetch('http://localhost:8000/graphql', {
            method: 'POST', body: JSON.stringify(requestBody), headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        }).then(res => {
            if (res.status !== 200 & res.status !== 201)
                throw new Error('Failed!');
            return res.json();
        })
            .then(resData => {
                console.log('resData', resData);
                this.setState(prevState => {
                    let updatedEvents = [...prevState.events]
                    updatedEvents.push({ _id: resData.data.createEvent._id, title: resData.data.createEvent.title, description: resData.data.createEvent.description, price: resData.data.createEvent.price, date: resData.data.createEvent.date, creator: { _id: this.context.userId } })
                    this.setState({ isLoading: false })
                    return { events: updatedEvents }
                });
            })
            .catch(error => { console.log(error) })
        this.setState({ modalDisplay: false })
    }
    fetchEvents = (context) => {

        if (this.isActive)
            this.setState({ isLoading: true })
        const requestBody = {
            query: `
            query  {events{
                _id
                title
                price
                date
                description
                creator {
                    _id
                    email
                }
            }}
            `
        }
        fetch('http://localhost:8000/graphql', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }).then(response => {
            if (response.status !== 200 && response.status !== 201)
                throw new Error('Failed!');
            return response.json()
        }
        )
            .then(result => {
                console.log(result)
                if (this.isActive)
                    this.setState({ events: result.data.events, isLoading: false })
            })
            .catch(error => {
                console.log(error);
                this.setState({ isLoading: false })

            })



    }

    showEventDetails = eventId => {
        console.log('selected event')
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId)
            console.log(selectedEvent);
            return { selectedEvent: selectedEvent }
        });
    }

    onViewEventCancel = () => {
        this.setState({ selectedEvent: null })
    }

    onBookEventConfirm = () => {

        //book event
        const token = this.context.token;

        if (!token) {
            this.setState({ selectedEvent: null })
            return
        }
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
            mutation  {bookEvent(eventId: "${this.state.selectedEvent._id}"){
               event {
                   title
               }
               user {
                   email
               }
               createdAt
               updatedAt
            }}
            `
        }
        fetch('http://localhost:8000/graphql', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(requestBody)
        }).then(response => {
            if (response.status !== 200 && response.status !== 201)
                throw new Error('Failed!');
            return response.json()
        }
        )
            .then(result => {
                console.log(result)
                this.setState({ selectedEvent: null, isLoading: false })

                // this.setState(prevState => {
                //     let updatedBookings = [...prevState.bookedEvents]
                //     // updatedBookings.push({result.data.bookEvent.})
                //     // return { bookedEvents: updatedBookings, isLoading: false }
                // })
            })
            .catch(error => {
                console.log(error);
                this.setState({ selectedEvent: null, isLoading: false })

            })

    }
    render() {
        return (<React.Fragment>
            {this.state.modalDisplay &&
                (<React.Fragment>
                    <Backdrop />
                    <Modal title="add Event" canCancel canConfirm onCancel={this.closeModal} onConfirm={this.confirmCreateEvent}>
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="title" id="title" ref={this.titleElRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" min="0" ref={this.priceElRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="date" ref={this.dateElRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" rows="4" ref={this.descriptionElRef}></textarea>
                            </div>
                        </form>
                    </Modal>
                </React.Fragment>
                )

            }

            {this.context.token && <div className='events-control'>
                <p>Share your own events!</p>
                <button className='btn' onClick={this.displayModal}>Create event</button>
            </div>}

            {this.state.isLoading ? <Spinner /> : <EventsList events={this.state.events} authUserId={this.context.userId} onViewDetail={this.showEventDetails} />
            }
            {this.state.selectedEvent &&

                (<React.Fragment>
                    <Backdrop />
                    <Modal title={this.state.selectedEvent.title} canCancel canConfirm onCancel={this.onViewEventCancel} onConfirm={this.onBookEventConfirm} confirmText={this.context.token ? "Book" : "Confirm"}>
                        <h2> {this.state.selectedEvent.description}</h2>
                        <h6>{this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h6>
                    </Modal>
                </React.Fragment>

                )}

        </React.Fragment >
        )
    }
}

export default EventsPage;