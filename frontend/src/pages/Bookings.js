import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';

class BookingsPage extends Component {

    state = { bookings: [], isLoading: false }
    static contextType = AuthContext;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.fetchBookings()
    }
    fetchBookings = () => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
            query {
                bookings {
                    _id
                    event {
                        _id
                        title
                        date }
                    user {email}
                    createdAt
                    updatedAt
                }
            }`
        }
        const token = this.context.token;
        fetch('http://localhost:8000/graphql', {
            'method': 'POST', 'body': JSON.stringify(requestBody), 'headers': {
                'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            if (response.status !== 200 && response.status !== 201) {
                this.setState({ isLoading: false });
                throw new Error('Failed!')
            }
            return response.json()
        })
            .then(result => {
                this.setState({ bookings: result.data.bookings })
                this.setState({ isLoading: false });
            })
            .catch(error => {
                console.log(error)
                this.setState({ isLoading: false });
            })
    }
    render() {
        return (
            <div>
                {

                    this.state.isLoading && <Spinner />

                }
                {this.state.bookings && !this.state.isLoading && (<ul>{
                    this.state.bookings.map(booking => { return (<li key={booking._id}>{booking.event.title} - booked by {booking.user.email}: {new Date(booking.createdAt).toLocaleDateString()}</li>) }

                    )
                }
                    {!this.state.isLoading && !this.state.bookings && 'No bookings added yet'}
                </ul>)
                }
            </div>
        )

    }
}
export default BookingsPage;