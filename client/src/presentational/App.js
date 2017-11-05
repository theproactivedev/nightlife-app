import React, {Component} from 'react';
import Navigation from './Navigation';
import Content from './Content';

class App extends Component {
	constructor() {
		super();
		this.state = {
			isAuthenticated: false,
			user: "",
			identification: ""
		};

		this.onLogin = this.onLogin.bind(this);
		this.onLogout = this.onLogout.bind(this);
	}

	componentWillMount() {
		if (localStorage['ytrap'] !== undefined) {
			var user = JSON.parse(localStorage['ytrap']);
			this.setState({
				user: user.name,
				isAuthenticated: true,
				identification: user.identity
			});
		}
	}

	onLogin(isUserAuthenticated, userName, userId) {
		this.setState({
			isAuthenticated: isUserAuthenticated,
			user: userName,
			identification: userId
		});
	}

	onLogout() {
		this.setState({
			isAuthenticated: false,
			user: "",
			identification: ""
		});
	}

	render() {
		return(
			<div>
				<Navigation onUserLogin={this.onLogin} onUserLogout={this.onLogout} />
				<Content isUserAuthenticated={this.state.isAuthenticated}
				  userName={this.state.user} userId={this.state.identification} />
			</div>
		);
	}
}

export default App;
