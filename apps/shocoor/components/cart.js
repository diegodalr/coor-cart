import React, { useState, useEffect } from 'react';
import client from '../utils/graphql/client';
import productQuery from '../utils/graphql/productQuery';
import { NumberField } from '@base-ui-components/react/number-field';

const Cart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [cartTotal, setCartTotal] = useState(0);

	const fetchCartData = async () => {
		try {
			const { data, errors, extensions } = await client.request(productQuery);
			const response = data.products.edges.map((item) => {
				return {
					id: item.node.id,
					name: item.node.title,
					price: parseFloat(
						item.node.variants.edges[0].node.price.amount
					),
					quantity: Math.floor(Math.random() * 5) + 1,
					image: item.node.featuredImage.url,
				};
			});
			setCartItems(response);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching cart data:', error);
			setLoading(false);
		}
	};

	const updateQuantity = (productId, newQuantity) => {
		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.id === productId
					? { ...item, quantity: newQuantity }
					: item
			)
		);
	};

	const removeProduct = (productId) => {
		setCartItems((prevItems) =>
			prevItems.filter((item) => item.id !== productId)
		);
	};

	useEffect(() => {
		fetchCartData();
	}, []);

	useEffect(() => {
		const total = cartItems.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
		);
		setCartTotal(total);
	}, [cartItems]);

	if (loading) return <div>Loading...</div>;

	// TODO: Add empty cart state, optimization to reuse components.
	return (
		<div className="woocoor-cart wc-block-components-sidebar-layout wc-block-cart wp-block-woocommerce-filled-cart-block is-large">
			<section className="py-24 relative">
				<div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
					<h2 className="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black">Shopping Cart</h2>
					{cartItems.map((item) => (
						<div key={item.id} className="rounded-3xl border-2 border-gray-200 p-4 lg:p-8 grid grid-cols-12 mb-8 max-lg:max-w-lg max-lg:mx-auto gap-y-4 ">
							<div className="col-span-12 lg:col-span-2 img box">
								<img src={item.image} alt={item.name} width={100} height={100} className="max-lg:w-full lg:w-[180px] rounded-lg object-cover" />
							</div>
							<div className="col-span-12 lg:col-span-10 detail w-full lg:pl-3">
								<div className="flex items-center justify-between w-full mb-4">
									<h5 className="font-manrope font-bold text-2xl leading-9 text-gray-900">{item.name}</h5>
									<button onClick={() => removeProduct(item.id)} className="rounded-full group flex items-center justify-center focus-within:outline-red-500">
										<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
											<circle className="fill-red-50 transition-all duration-500 group-hover:fill-red-400" cx="17" cy="17" r="17" fill=""></circle>
											<path className="stroke-red-500 transition-all duration-500 group-hover:stroke-white" d="M14.1673 13.5997V12.5923C14.1673 11.8968 14.7311 11.333 15.4266 11.333H18.5747C19.2702 11.333 19.834 11.8968 19.834 12.5923V13.5997M19.834 13.5997C19.834 13.5997 14.6534 13.5997 11.334 13.5997C6.90804 13.5998 27.0933 13.5998 22.6673 13.5997C21.5608 13.5997 19.834 13.5997 19.834 13.5997ZM12.4673 13.5997H21.534V18.8886C21.534 20.6695 21.534 21.5599 20.9807 22.1131C20.4275 22.6664 19.5371 22.6664 17.7562 22.6664H16.2451C14.4642 22.6664 13.5738 22.6664 13.0206 22.1131C12.4673 21.5599 12.4673 20.6695 12.4673 18.8886V13.5997Z" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round"></path>
										</svg>
									</button>
								</div>
								<p className="font-normal text-base leading-7 text-gray-500 mb-6">
									Price ${item.price}
								</p>
								<div className="flex justify-between items-center">
									<div className="flex items-center gap-4">
										<NumberField.Root
											id={item.id}
											value={item.quantity}
											className="flex flex-col items-start gap-1"
											onValueChange={(value) =>
												updateQuantity(item.id, value)
											}
											min={1}>
											<NumberField.ScrubArea className="cursor-ew-resize">
												<label
													htmlFor={item.id}
													className="cursor-ew-resize text-sm font-medium text-gray-900">
													Quantity
												</label>
												<NumberField.ScrubAreaCursor className="drop-shadow-[0_1px_1px_#0008] filter">
													<svg
														width="26"
														height="14"
														viewBox="0 0 24 14"
														fill="black"
														stroke="white"
														xmlns="http://www.w3.org/2000/svg">
														<path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
													</svg>
												</NumberField.ScrubAreaCursor>
											</NumberField.ScrubArea>
											<NumberField.Group className="flex">
												<NumberField.Decrement className="flex size-10 items-center justify-center rounded-tl-md rounded-bl-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100">
													<svg
														width="10"
														height="10"
														viewBox="0 0 10 10"
														fill="none"
														stroke="currentcolor"
														strokeWidth="1.6"
														xmlns="http://www.w3.org/2000/svg">
														<path d="M0 5H10" />
													</svg>
												</NumberField.Decrement>
												<NumberField.Input className="h-10 w-24 border-t border-b border-gray-200 text-center text-base text-gray-900 tabular-nums focus:z-1 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800" />
												<NumberField.Increment className="flex size-10 items-center justify-center rounded-tr-md rounded-br-md border border-gray-200 bg-gray-50 bg-clip-padding text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100">
													<svg
														width="10"
														height="10"
														viewBox="0 0 10 10"
														fill="none"
														stroke="currentcolor"
														strokeWidth="1.6"
														xmlns="http://www.w3.org/2000/svg">
														<path d="M0 5H5M10 5H5M5 5V0M5 5V10" />
													</svg>
												</NumberField.Increment>
											</NumberField.Group>
										</NumberField.Root>
									</div>
									<h6 className="text-indigo-600 font-manrope font-bold text-2xl leading-9 text-right">
										${(item.price * item.quantity).toFixed(2)}
									</h6>
								</div>
							</div>
						</div>
					))}
					<div className="flex flex-col md:flex-row items-center md:items-center justify-between lg:px-6 pb-6 border-b border-gray-200 max-lg:max-w-lg max-lg:mx-auto">
						<h5 className="text-gray-900 font-manrope font-semibold text-2xl leading-9 w-full max-md:text-center max-md:mb-4">Total</h5>
						<div className="flex items-center justify-between gap-5 ">
							<h6 className="font-manrope font-bold text-3xl lead-10 text-indigo-600">${cartTotal.toFixed(2)}</h6>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Cart;
