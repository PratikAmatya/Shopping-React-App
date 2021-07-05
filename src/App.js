import './index.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Login';
import NotFound from './NotFound';
import Product from './Product';
import Register from './Register';
import Cart from './Cart';
import { CartProvider } from './contexts/CartContext';

import Protected from './Protected';

function App() {
	return (
		<CartProvider>
			<Router>
				<Switch>
					<Route exact path="/login">
						<Login />
					</Route>
					<Route exact path="/product">
						<Protected component={Product} />
					</Route>
					<Route exact path="/cart">
						<Protected component={Cart} />
					</Route>
					<Route exact path="/register">
						<Register />
					</Route>
					<Route path="*">
						<NotFound />
					</Route>
				</Switch>
			</Router>
		</CartProvider>
	);
}

export default App;
