import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import './Events.css';

class EventsPage extends Component {
    state = { modalDisplay: false }

    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.descriptionElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();

    }
    displayModal = () => { this.setState({ modalDisplay: true }) }
    closeModal = () => { this.setState({ modalDisplay: false }) }
    confirmCreateEvent = (context) => {
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
                 
                creator {   
 
                    email 
                }
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
                console.log('resData', resData)
            })
            .catch(error => { console.log(error) })
         this.setState({ modalDisplay: false })
    }
    render() {
        return (
            <React.Fragment>
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
                <div className='events-control'>
                    <p>Share your own events!</p>
                    <button className='btn' onClick={this.displayModal}>Create event</button>
                </div>
            </React.Fragment>
        )
    }
}

export default EventsPage;