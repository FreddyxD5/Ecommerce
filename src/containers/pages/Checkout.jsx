import Layout from "../../hocs/layout"
import { connect } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { QuestionMarkCircleIcon } from "@heroicons/react/outline";
import CartItem from "../../components/cart/CartItem";
import { useState, useEffect } from "react";

import { setAlert } from "../../redux/actions/alert";

import {
    update_item,
    remove_item
} from "../../redux/actions/cart";

import { get_shipping_options } from "../../redux/actions/shipping";
import { check_coupon } from "../../redux/actions/coupons"

import { refresh } from "../../redux/actions/auth";

import {
    get_payment_total,
    get_client_token,
    process_payment
} from "../../redux/actions/payment";


import DropIn from "braintree-web-drop-in-react";
import { CradleLoader } from "react-loader-spinner";
import { countries } from "../../helpers/fixCountries"

import ShippingForm from "../../components/checkout/ShippingForm";

const Checkout = ({
    isAuthenticated,
    user,
    items,
    update_item,
    remove_item,
    setAlert,
    total_items,
    total_amount,
    total_compare_amount,
    get_shipping_options,
    shipping,
    clientToken,
    refresh,
    get_payment_total,
    get_client_token,
    process_payment,
    clienToken,
    made_payment,
    loading,
    original_price,
    total_after_coupon,
    estimated_tax,
    shipping_cost,
    check_coupon,   
    coupon 
}) => {
    const [formData, setFormData] = useState({
        full_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state_province_region: '',
        postal_zip_code: '',
        country_region: 'Pedu',
        telephone_number: '',        
        coupon_name:'',
        shipping_id: 0,
    })

    const [data, setData] = useState({
        instance: {}
    })
    const [render, setRender] = useState(false)    

    const {
        full_name,
        address_line_1,
        address_line_2,
        city,
        state_province_region,
        postal_zip_code,
        country_region,
        telephone_number,
        coupon_name,
        shipping_id
    } = formData;
        
    useEffect(() => {
        window.scrollTo(0, 0)
        get_shipping_options()
    }, [])

    useEffect(() => {
        get_client_token();
    }, [user])

    useEffect(() => {        
        {
            coupon &&
            coupon !== null
            && coupon !== undefined ?
            get_payment_total(shipping_id, coupon.name):
            get_payment_total(shipping_id, 'default')
        }            

    }, [shipping_id, coupon])

    const apply_coupon = async e =>{
        e.preventDefault()
        check_coupon(coupon_name)
    };

    if (!isAuthenticated)
        return <Navigate to="/" />

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const buy = async e =>{
        e.preventDefault()
        let nonce = await data.instance.requestPaymentMethod();
        if(coupon && coupon !== undefined && coupon !== null){
            process_payment(
                nonce,
                shipping_id,
                coupon.name,
                full_name,
                address_line_1,
                address_line_2,
                city,
                state_province_region,
                postal_zip_code,
                country_region,
                telephone_number
            );
        }else{
            process_payment(
                nonce,
                shipping_id,                
                full_name,
                address_line_1,
                address_line_2,
                city,
                state_province_region,
                postal_zip_code,
                country_region,
                telephone_number
            );
        }
    }

    const showItems = () => {
        return (
            <div>
                {
                    items &&
                    items !== null &&
                    items !== undefined &&
                    items.length !== 0 &&
                    items.map((item, index) => {
                        let count = item.count;
                        return (
                            <div key={index}>
                                <CartItem
                                    item={item}
                                    count={count}
                                    update_item={update_item}
                                    remove_item={remove_item}
                                    render={render}
                                    setRender={setRender}
                                    setAlert={setAlert}
                                />
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const checkOutButton = () => {
        if (total_items < 1) {
            return (
                <Link to="/shop">
                    <button
                        className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 justify-center">
                        Compremos algo
                    </button>
                </Link>
            )
        } else if (!isAuthenticated) {
            return (
                <Link to="/shop">
                    <button
                        className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 justify-center">
                        Login
                    </button>
                </Link>
            )
        } else {
            return (
                <Link to="/checkout">
                    <button
                        className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 justify-center">
                        Checkout
                    </button>

                </Link>
            )
        }

    }

    const renderShipping = () => {
        if (shipping && shipping !== null && shipping !== undefined) {
            return (
                <div className="mb-5">
                    {
                        shipping.map((shipping_option, index) => (
                            <div key={index}>
                                <input
                                    onChange={e => onChange(e)}
                                    value={shipping_option.id}
                                    name='shipping_id'
                                    type='radio'
                                    required
                                />

                                <label className="ml-4">
                                    {shipping_option.name} - ${shipping_option.price} ({shipping_option.time_to_delivery})
                                </label>
                            </div>
                        ))
                    }
                </div>
            )
        }
    }

    const renderPaymentInfo = () => {
        if (!clientToken) {
            if (!isAuthenticated) {
                <Link
                    to="/signin"
                    className="w-full ng-indigo-600 border-transparent rounded-md" > Login
                </Link>
            } else {
                <button className="w-full ng-indigo-600 border-transparent rounded-md">
                    <CradleLoader
                        color="#fff"
                        height={20}
                        width={20}
                    />
                </button>
            }
        } else {
            return (
                <>
                    <DropIn
                        options={{
                            authorization: clientToken,
                            paypal: {
                                flow: 'vault'
                            }
                        }}

                        onInstance={instance => (data.instance = instance )}
                    />
                    <div className="mt-6">
                        {loading ?
                            <button className="w-full bg-green-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-500">
                                <CradleLoader
                                    color="#fff"
                                    height={20}
                                    width={20}
                                />
                            </button> :
                            <button
                                type="submit"
                                className="w-full bg-green-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-500">
                                Place Order</button>
                        }
                    </div>

                </>
            )
        }
    }

    if(made_payment){
        return <Navigate to="/thankyou" />
    }
    return (
        <Layout>
            <div className="bg-white">
                <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Checkout </h1>
                    <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
                        <section aria-labelledby="cart-heading" className="lg:col-span-7">
                            <h2 id="cart-heading" className="sr-only">
                                Items in your shopping cart
                            </h2>
                            <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                                {showItems()}
                            </ul>
                        </section>
                        <ShippingForm
                            full_name={full_name}
                            address_line_1={address_line_1}
                            address_line_2={address_line_2}
                            city={city}
                            contry_region={country_region}
                            state_province_region={state_province_region}
                            postal_zip_code={postal_zip_code}
                            telephone_number={telephone_number}
                            countries={countries}
                            onChange={onChange}
                            coupon={coupon}
                            coupon_name={coupon_name}
                            apply_coupon={apply_coupon}
                            buy={buy}
                            user={user}
                            renderShipping={renderShipping}
                            total_amount={total_amount}
                            total_compare_amount={total_compare_amount}
                            total_after_coupon = {total_after_coupon}
                            shipping_cost={shipping_cost}
                            shipping_id={shipping_id}
                            shipping={shipping}
                            estimated_tax={estimated_tax}
                            checkOutButton={checkOutButton}
                            renderPaymentInfo={renderPaymentInfo}

                        />
                    </div>
                </div>
            </div>

        </Layout>
    )
}
const mapStateToProps = state => ({
    isAuthenticated: state.Auth.isAuthenticated,
    user: state.Auth.user,
    items: state.Cart.items,
    total_items: state.Cart.total_items,
    shipping: state.Shipping.shipping,
    clientToken: state.Payment.clientToken,
    total_amount: state.Cart.amount,
    total_compare_amount: state.Cart.compare_amount,
    clienToken: state.Payment.clientToken,
    made_payment: state.Payment.made_payment,
    loading: state.Payment.loading,
    original_price: state.Payment.original_price,
    total_after_coupon: state.Payment.total_after_coupon,
    estimated_tax: state.Payment.estimated_tax,    
    shipping_cost: state.Payment.shipping_cost,
    coupon : state.Coupons.coupon,

})
export default connect(mapStateToProps, {
    update_item,
    remove_item,
    setAlert,
    get_shipping_options,
    get_payment_total,
    get_client_token,
    process_payment,
    check_coupon,
})(Checkout);