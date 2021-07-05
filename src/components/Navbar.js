import { Link, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = ({ cart }) => {
	const history = useHistory();
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
			<Link to="/product" className="navbar-brand">
				Online Pasal
			</Link>
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarText"
				aria-controls="navbarText"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarText">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item active">
						<Link to="/product" className="nav-link ">
							<i className="fab fa-product-hunt"></i> Products
							<span className="sr-only">(current)</span>
						</Link>
					</li>
					<li className="nav-item ">
						<Link to="/cart" className="nav-link  text-white">
							<i className="fas fa-shopping-cart"></i> Cart
							<span className="badge badge-secondary ml-1">{cart.length}</span>
						</Link>
					</li>
				</ul>
				<span
					className="navbar-text font-weight-bold text-white link-logout"
					onClick={() => {
						Cookies.set('userJWT', '', { expires: 1 / (60 * 60 * 24) });
						history.push('/login');
					}}
				>
					Logout
				</span>
			</div>
		</nav>
	);
};

export default Navbar;
