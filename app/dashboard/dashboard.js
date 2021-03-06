import {Redirect} from 'react-router-dom';
import Header from './header/header';

import Overlay from './../commons/components/overlay/overlay';
import Ids from './body/ids';
import Account from './body/account';

import {getUserData, getAllUsersData} from './../commons/utils/user-service';
import {logoutRedirect} from './../commons/utils/auth';
import {isTokenSet, removeToken} from './../commons/utils/tokens';
import {getUser, setUser} from './../commons/utils/user-data';

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: 'Dashboard',
			forceLogout: false,
			loading: true
		}

		this.renderPage = this.renderPage.bind(this);
	}

	componentDidMount() {
		console.log("componentDidMount, Dashboard", this.props);
		let {location: {pathname}} = this.props;
			console.log("getUser", getUser());
		if(!getUser()) {
			getUserData().then(({payload}) => {
				console.log("payload", payload);
				this.setState({...payload, firstlog: !!!payload.email, pathname});
				setUser(payload);
			})
			.catch(e => {
				removeToken();
				this.setState({forceLogout: true});
			})
			.finally(() => this.setState({loading: false}));
		} else {
			this.setState({...getUser(), firstlog: false, loading: false, pathname});
		}
	}

	renderPage() {
		let {pathname = '/', email = '', name = '', phone = '', ids = {}, firstLog} = this.state;

		switch(pathname) {
			case '/':
			case '/indecsi':
				return <Ids />
			case '/contul-meu':
				return <Account />
			case '/guestbook':
				return <div dangerouslySetInnerHTML={{__html: "<iframe src='https://minnit.chat/LaBloc?embedweb' width='100%' height='500' style='border:none;' allowTransparency='true'></iframe>"}} />
			default:
				return null;
		}
	}

	render() {
		const {forceLogout, loading, pathname} = this.state;
    	if(forceLogout) return <Redirect to='/' />

		return (
			<div className="dashboard">
				{loading ? <Overlay /> : <div>
					<Header logout={() => logoutRedirect(() => this.setState({forceLogout: true}))} pathname={pathname}/>
					{this.renderPage()}
				</div>}
			</div>
		)
	}
}