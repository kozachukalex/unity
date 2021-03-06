import React, { Component } from "react";
import { Input } from 'react-materialize';
import UserMessage from '../userMessage';
import API from '../../utils/API';
import './userMessages.css';
import openSocket from 'socket.io-client';

export default class Messages extends Component {
	state= {
		message: ''
	}
	handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
	};
	handleSubmit = event => {
		console.log(this.props.user);
		event.preventDefault();
		API.createMsg(this.state.message, this.props.user._id)
		.then(response => {
			window.Materialize.toast('Message Sent', 2000);
			emit('New message from your client: ' + this.props.user.username);
			this.setState({ message: '' });
		})
		.catch(err => console.log(err));
	}
	render() {
		//filter down to only messages sent by the advisor
		const filteredMessages = this.props.user.messages.filter(message => message.author !== this.props.user.username);
		return (
			<div class="user-messages-container">
				<div className="user-messages-display">
					<h4>Messages</h4>
					{filteredMessages.slice(0).reverse().map(message => 
						<UserMessage message={message} getUser={this.props.getUser} />
					)}
				</div>
				<div className="user-message-form">
					<h4>Compose Message</h4>
					<form onSubmit={this.handleSubmit}>
							<label> To: <span id="advisor-name">{this.props.user.advisor}</span> </label>
							<Input
								label="your message"
								name="message"
								type="textarea"
								value={this.state.message}
								onChange={this.handleChange('message')}
							/>
						<button type="submit" className="formSubmit waves-effect waves-light btn">SEND</button>
					</form>
				</div>
			</div>
		)
	}
}

function emit(msg) {
	const socket = openSocket();
	socket.emit('message2', msg) 
}