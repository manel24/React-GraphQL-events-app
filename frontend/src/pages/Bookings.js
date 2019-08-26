import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import BookingControls from '../components/Bookings/BookingControls/BookingControls';

class BookingsPage extends Component {

    state = { bookings: [], isLoading: false, outputType: 'list' }
    static contextType = AuthContext;

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
                        date
                        price }
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

    onBookingDelete = (bookingId) => {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
            mutation cancelBooking ($id: ID!) {
                cancelBooking(bookingId: $id) {
                    _id
                    title
                }
            }`,
            variables: { id: bookingId }
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
                this.setState(prevState => {
                    return {
                        bookings: prevState.bookings.filter(booking => { return booking._id !== bookingId }),
                        isLoading: false
                    }
                })
            }
            )
            .catch(error => {
                console.log(error)
                this.setState({ isLoading: false })
            })
    }

    changeOutputTypeHandler = (outputType) => {
        if (this.state.outputType === 'list')
            this.setState({ outputType: 'chart' })
        else
            this.setState({ outputType: 'list' })
    }

    render() {
        let content = <Spinner />
        if (!this.state.isLoading)
            content = (
                <React.Fragment>
                    <div>
                        <BookingControls changeOutputTypeHandler={this.changeOutputTypeHandler} activeOutputClass={this.state.outputType} />
                    </div>
                    <div>
                        {this.state.outputType === 'list'
                            ?
                            <BookingList bookings={this.state.bookings} onDelete={this.onBookingDelete} />
                            : <BookingChart bookings={this.state.bookings} />}

                    </div>

                </React.Fragment>
            )
        return <React.Fragment>{content}</React.Fragment>;
    }
}
export default BookingsPage;