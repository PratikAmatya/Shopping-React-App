import { useHistory } from 'react-router';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const Protected = ({ component: Component }) => {
	const history = useHistory();
	const jwtCookie = Cookies.get('userJWT');

	if (jwtCookie) {
		const decodedJwtCookie = jwt_decode(jwtCookie);
		if (!decodedJwtCookie.id) {
			history.push('/login');
		}
	} else {
		history.push('/login');
	}

	return (
		<div>
			<Component />
		</div>
	);
};

export default Protected;
