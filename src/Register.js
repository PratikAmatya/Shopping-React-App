import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';

const Register = () => {
	const history = useHistory();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [isPending, setIsPending] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setIsPending(true);
			const res = await fetch('http://localhost:8000/user/register', {
				method: 'POST',
				body: JSON.stringify({ email, password }),
				headers: { 'Content-Type': 'application/json' },
			});

			const data = await res.json();
			console.log(data);
			if (data.error) {
				setIsPending(false);
				setEmailError(data.error.email);
				setPasswordError(data.error.password);
			}
			if (data.user) {
				setIsPending(false);
				history.push('/product');
			}
		} catch (error) {
			setIsPending(false);
			console.log(error);
		}
	};

	return (
		<div className="register" id="register">
			<main
				className="container p-3 p-sm-5 rounded-0 border-white border"
				id="mainDiv"
			>
				<span className="h4 brand">ONLINE PASAL</span>
				<br />
				<div className="title mt-3 mb-2">
					<span className="h5 font-weight-bold">Register</span>
				</div>
				<form
					id="registerForm"
					onSubmit={(e) => {
						handleSubmit(e);
					}}
				>
					<div className="form-group mt-3 mb-3">
						<label htmlFor="email">Email Address</label>
						<input
							type="email"
							name="email"
							id="email"
							className="form-control form-control-lg  login-input border-dark rounded-0"
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							required
						/>
						<div className="text-danger">{emailError}</div>
					</div>
					<div className="form-group mb-0">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							name="password"
							id="password"
							minLength="6"
							className="form-control form-control-lg login-input border-dark rounded-0"
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							required
						/>
						<div className="text-danger">{passwordError}</div>
					</div>
					<button
						type="submit"
						form="registerForm"
						className="btn-dark btn mt-3 px-4"
					>
						Register
						{isPending && (
							<div className="spinner-border text-light ml-3" role="status">
								<span className="sr-only">Loading...</span>
							</div>
						)}
					</button>
					<div className="form-group mt-3">
						<Link to="/login" className="font-weight-bold">
							Already a member? Login Here
						</Link>
					</div>
				</form>
			</main>
		</div>
	);
};

export default Register;
