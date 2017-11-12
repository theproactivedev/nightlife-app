import React, {Component} from 'react';
import Navigation from './Navigation';
import Content from './Content';

class App extends Component {
	constructor() {
		super();
		this.state = {
			isAuthenticated: false,
			user: "",
			identification: "",
			token: ""
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
				identification: user.identity,
				token: user.token
			});
		}
	}

	onLogin(isUserAuthenticated, userName, userId, userToken) {
		this.setState({
			isAuthenticated: isUserAuthenticated,
			user: userName,
			identification: userId,
			token: userToken
		});
	}

	onLogout() {
		this.setState({
			isAuthenticated: false,
			user: "",
			identification: "",
			token: ""
		});
	}

	render() {
		return(
			<div>
				<Navigation onUserLogin={this.onLogin} onUserLogout={this.onLogout} />
				<Content isUserAuthenticated={this.state.isAuthenticated}
				  userName={this.state.user} userId={this.state.identification}
					userToken={this.state.token} />
			</div>
		);
	}
}

export default App;
