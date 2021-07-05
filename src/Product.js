import { useState, useEffect, useContext } from 'react';
import { CartContext } from './contexts/CartContext';
import Navbar from './components/Navbar';

const Product = () => {
	const [cart, setCart] = useContext(CartContext);
	const [products, setProducts] = useState([]);
	const [isPending, setIsPending] = useState(true);
	const [error, setError] = useState(null);

	const handleAddToCartClick = (product) => {
		if (cart.length === 0) {
			setCart([
				{
					productId: product._id,
					productName: product.productName,
					quantity: 1,
					unitPrice: product.price,
					totalItemPrice: product.price,
				},
			]);
		} else {
			const exist = cart.find((item) => item.productId === product._id);
			if (!exist) {
				setCart([
					...cart,
					{
						productId: product._id,
						productName: product.productName,
						quantity: 1,
						unitPrice: product.price,
						totalItemPrice: product.price,
					},
				]);
			}
		}
	};

	const url = 'http://localhost:8000/product';

	useEffect(() => {
		const abortCont = new AbortController();
		fetch(url, { signal: abortCont.signal })
			.then((response) => {
				if (!response.ok) {
					throw Error('Could not fetch the data for that resource');
				}
				return response.json();
			})
			.then((json) => {
				setError(null);
				setIsPending(false);
				setProducts(json);
			})
			.catch((err) => {
				if (err.name === 'AbortError') {
					console.log('fetch aborted');
				} else {
					setIsPending(false);
					setError(err.message);
				}
			});
		return () => {
			abortCont.abort();
		};
	}, [url]);

	return (
		<>
			<Navbar cart={cart} />
			<div className="Product">
				<h4 className="h2 pt-3 pl-sm-5 ">Products Page</h4>
				{isPending && (
					<div className="loading text-center" style={{ marginTop: 100 }}>
						<span className="h4">Loading. Please wait </span>

						<div className="spinner-grow mr-3" role="status">
							<span className="sr-only">Loading...</span>
						</div>
						<div className="spinner-grow mr-3" role="status">
							<span className="sr-only">Loading...</span>
						</div>
						<div className="spinner-grow mr-3" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				)}

				{error && (
					<span className="text-danger text-center pl-5">
						Something went wrong. Please reload the page again.
					</span>
				)}

				{products.length > 0 && (
					<div className="jumbotron bg-white pl-2  mb-0 pb-0" id="cards">
						{products.map((product) => (
							<div className="card" key={product._id}>
								<img
									src="https://cdn.pixabay.com/photo/2020/08/26/14/09/school-items-5519578_960_720.png"
									className="card-img-top card-img"
									alt="product"
								/>
								<div className="card-body">
									<h5 className="card-title">{product.productName}</h5>
									<div className="row">
										<div className="col-sm-5">
											<h5 className="card-title text-primary">
												Rs. {product.price}
											</h5>
										</div>
										<div className="col-sm-7">
											<h5 className="card-title h6 text-success">
												{product.quantity} left in stock
											</h5>
										</div>
									</div>

									<p className="card-text">{product.description}</p>
									<div className="row px-3 ">
										<button
											className="btn btn-warning w-100"
											onClick={() => {
												handleAddToCartClick(product);
											}}
										>
											Add to cart
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
};

export default Product;
