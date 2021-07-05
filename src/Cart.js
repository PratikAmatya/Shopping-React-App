import { useEffect, useState, useContext } from 'react';
import { CartContext } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const Cart = () => {
	const [cart, setCart] = useContext(CartContext);
	const [totalPrice, setTotalPrice] = useState(0);
	const [orderStatus, setOrderStatus] = useState('');
	const [deliveryAddress, setDeliveryAddress] = useState('');

	const jwtCookie = Cookies.get('userJWT');
	const decodedJwtCookie = jwt_decode(jwtCookie);
	const userId = decodedJwtCookie.id;

	const handleDelete = (itm) => {
		const newCart = cart.filter((item) => item !== itm);
		setCart(newCart);
	};

	const handleDecreaseQuantity = (item) => {
		const newCart = cart.filter((itm) => item !== itm);
		cart.map((itm) => {
			if (itm.productId === item.productId) {
				if (itm.quantity !== 1) {
					const index = cart.indexOf(itm);
					item.quantity -= 1;
					item.totalItemPrice = itm.quantity * itm.unitPrice;
					newCart.splice(index, 0, item);
					setCart(newCart);
				}
			}
			return '';
		});
	};

	const handleAddQuantity = (item) => {
		const newCart = cart.filter((itm) => item !== itm);
		cart.map((itm) => {
			if (itm.productId === item.productId) {
				const index = cart.indexOf(itm);
				item.quantity += 1;
				item.totalItemPrice = itm.quantity * itm.unitPrice;
				newCart.splice(index, 0, item);
				setCart(newCart);
			}
			return '';
		});
	};

	useEffect(() => {
		let tPrice = 0;
		cart.map((item) => {
			tPrice += item.totalItemPrice;
			return '';
		});
		setTotalPrice(tPrice);
	}, [cart]);

	const handleOrder = (e) => {
		console.log({
			userId,
			deliveryAddress,
			cart,
			totalPrice: parseFloat(totalPrice),
		});

		if (cart.length !== 0) {
			try {
				e.preventDefault();
				fetch('http://localhost:8000/order', {
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
					},
					body: JSON.stringify({
						userId,
						deliveryAddress,
						cart,
						totalPrice: parseFloat(totalPrice),
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						console.log(data);
						if (data.error) {
							setOrderStatus('authFail');
						} else {
							setCart([]);
							setOrderStatus('success');
						}
					});
			} catch (err) {
				setOrderStatus('failure');
			}
		}
	};

	return (
		<>
			<Navbar cart={cart} />
			<div className="bg-white ml-2">
				<h4 className="h2 pl-sm-5 mt-sm-5 mt-2">Shopping Cart</h4>
			</div>

			{cart.length === 0 && (
				<span className="pl-5 d-block text-center mt-5 h5">
					No items in cart.
				</span>
			)}
			<div className="cart">
				{cart.length > 0 && (
					<div className="jumbotron bg-white table-responsive mb-0  mt-3 pt-0 pb-0 ">
						<table className="table">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Product name</th>
									<th scope="col">Quantity</th>
									<th scope="col">Price</th>
									<th scope="col"></th>
								</tr>
							</thead>
							<tbody>
								{cart.map((item) => (
									<tr key={item.productId}>
										<th scope="row">{cart.indexOf(item) + 1}</th>
										<td>{item.productName}</td>
										<td>
											<button
												className="btn btn-primary border-primary rounded-0 btn-sm"
												onClick={() => {
													handleAddQuantity(item);
												}}
											>
												+
											</button>
											<span className="px-1 px-sm-4 ">{item.quantity}</span>
											<button
												className="btn  btn-dark border-dark rounded-0 btn-sm"
												onClick={() => {
													handleDecreaseQuantity(item);
												}}
											>
												--
											</button>
										</td>

										<td>{item.totalItemPrice}</td>
										<td>
											<button
												className="btn btn-danger"
												onClick={() => {
													handleDelete(item);
												}}
											>
												<i className="fas fa-trash-alt"></i>
											</button>
										</td>
									</tr>
								))}

								<tr>
									<td></td>
									<td></td>
									<td></td>
									<th scope="row">Total Price:</th>
									<td>Rs. {totalPrice}</td>
								</tr>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td>
										<button
											className="btn btn-info"
											data-toggle="modal"
											data-target="#staticBackdrop"
										>
											Place Order
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				)}
			</div>
			<div
				className="modal fade"
				id="staticBackdrop"
				// data-backdrop="static"
				// data-keyboard="false"
				tabIndex="-1"
				aria-labelledby="staticBackdropLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="staticBackdropLabel">
								Delivery Address
							</h5>
							<button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close"
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<form
								id="deliveryAddress"
								onSubmit={(e) => {
									handleOrder(e);
								}}
							>
								<div className="input-group flex-nowrap">
									<div className="input-group-prepend">
										<span className="input-group-text" id="addon-wrapping">
											<i className="fas fa-truck"></i>
										</span>
									</div>
									<input
										type="text"
										className="form-control"
										placeholder="Delivery Address"
										aria-label="Delivery Address"
										aria-describedby="addon-wrapping"
										required
										minLength="8"
										value={deliveryAddress}
										onChange={(e) => {
											setDeliveryAddress(e.target.value);
										}}
									/>
								</div>
							</form>
							{orderStatus === 'success' && (
								<span className="text-success">
									The order has successfully placed.
								</span>
							)}
							{orderStatus === 'authFail' && (
								<span className="text-danger">
									The order has not been placed due to user verification error.
								</span>
							)}
							{orderStatus === 'failure' && (
								<span className="text-danger">Something went wrong.</span>
							)}
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-outline-secondary "
								data-dismiss="modal"
								onClick={() => {
									setOrderStatus('');
								}}
							>
								Close
							</button>
							<button
								type="submit"
								form="deliveryAddress"
								className="btn btn-success"
							>
								Confirm Order
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Cart;
