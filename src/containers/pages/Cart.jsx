import Layout from "../../hocs/layout";
import { CheckIcon, ClockIcon, QuestionMarkCircleIcon, XIcon } from '@heroicons/react/solid'
import { connect } from "react-redux"
import { Link } from "react-router-dom";
import {
  get_items,
  get_total,
  get_item_total,
  remove_item,
  update_item
} from "../../redux/actions/cart"
import { useEffect, useState } from "react";
import CartItem from "../../components/cart/CartItem";
import { setAlert } from "../../redux/actions/alert";



const Cart = ({
  get_items,
  get_total,
  get_item_total,
  items,
  amount,
  compare_amount,
  update_item,
  remove_item,
  total_items,
  isAuthenticated,
  setAlert
}) => {

  const [render, setRender] = useState(false)

  useEffect(() => {
    get_items()
    get_total()
    get_item_total()
  }, [render])

  const showItems = () => {
    return (
      <div>
        <h4>Your cart has  {total_items}</h4>
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
  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>
              <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                {showItems()}
              </ul>
            </section>
            <section
              aria-labelledby="summary-heading"
              className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
            >
              <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                Order summary
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">${amount.toFixed(2)}</dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Estimate price</span>
                    {/* <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Learn more about how shipping is calculated</span>
                    <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                  </a> */}
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">${compare_amount.toFixed(2)}</dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="flex text-sm text-gray-600">
                    <span>Discount</span>
                    <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Learn more about how tax is calculated</span>
                      <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">$0.00</dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Order total</dt>
                  <dd className="text-base font-medium text-gray-900">${amount.toFixed(2)}</dd>
                </div>
              </dl>              

              <div className="mt-6">               
                {checkOutButton()}
              </div>
            </section>
          </div>
        </div>
      </div>


    </Layout>
  )
}
const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated,
  items: state.Cart.items,
  amount: state.Cart.amount,
  compare_amount: state.Cart.compare_amount,
  total_items: state.Cart.total_items
})

export default connect(mapStateToProps, {
  get_items,
  get_total,
  get_item_total,
  remove_item,
  update_item,
  setAlert,
})(Cart);