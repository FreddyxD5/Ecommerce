import moment from "moment"
import Layout from "../../hocs/layout";
import { connect } from "react-redux";
import { list_orders } from "../../redux/actions/orders";
import DashboardLink from "../../components/dashboard/DashboardLink";
import { setAlert } from "../../redux/actions/alert";

import {
    get_items,
    get_total,
    get_item_total,
} from "../../redux/actions/cart"
import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { get_order_detail } from "../../redux/actions/orders";

import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    BellIcon,
    HomeIcon,
    MenuAlt2Icon,
    XIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/outline'

import { SearchIcon } from '@heroicons/react/solid'

import OrderItem from "../../components/order/OrderItem";


const products = [
    {
        id: 1,
        name: 'Distant Mountains Artwork Tee',
        price: '$36.00',
        description: 'You awake in a new, mysterious land. Mist hangs low along the distant mountains. What does it mean?',
        address: ['Floyd Miles', '7363 Cynthia Pass', 'Toronto, ON N3Y 4H8'],
        email: 'f•••@example.com',
        phone: '1•••••••••40',
        href: '#',
        status: 'Processing',
        step: 1,
        date: 'March 24, 2021',
        datetime: '2021-03-24',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/confirmation-page-04-product-01.jpg',
        imageAlt: 'Off-white t-shirt with circular dot illustration on the front of mountain ridges that fade.',
    },
    // More products...
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const DashboardPaymentsDetail = ({
    get_items,
    get_total,
    get_item_total,
    get_order_detail,
    order,
    isAuthenticated,
    user

}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const params = useParams()
    const transaction_id = params.transaction_id


    useEffect(() => {
        get_order_detail(transaction_id)
        list_orders()
        get_items()
        get_total()
        get_item_total()

    }, [transaction_id])



    const ShowItems = () => {
        return (
            <>
                {
                    order &&
                        order !== null &&
                        order !== undefined &&
                        order.order_items.length !== 0 ?
                        order.order_items.map((item, index) => {
                            return (
                                <div key={index}>
                                    <OrderItem
                                        item={item}
                                        setAlert={setAlert}
                                    />
                                </div>
                            )
                        }) :
                        <div> Tienes que loguearte para usar esta función.</div>
                }
            </>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }
    return (
        <>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                        </Transition.Child>
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex-shrink-0 flex items-center px-4">
                                    <Link to="/" >
                                        <img
                                            className="h-8 w-auto"
                                            src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                                            alt="Workflow"
                                        />
                                    </Link>
                                </div>
                                <div className="mt-5 flex-grow flex flex-col">
                                    <nav className="flex-1 px-2 pb-4 space-y-1">
                                        <DashboardLink />
                                    </nav>
                                </div>

                                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                                    <nav className="px-2 space-y-1">
                                        <Link to="/dashboard"

                                            className={classNames(
                                                'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                                'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                            )}
                                        >
                                            <HomeIcon
                                                className={classNames(
                                                    'text-gray-400 group-hover:text-gray-500',
                                                    'mr-4 flex-shrink-0 h-6 w-6'
                                                )}
                                                aria-hidden="true"
                                            />
                                            Dashboard
                                        </Link>
                                    </nav>
                                </div>

                            </div>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14" aria-hidden="true">
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <Link to="/">
                                <img
                                    className="h-8 w-auto"
                                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                                    alt="Workflow"
                                />
                            </Link>
                        </div>
                        <div className="mt-5 flex-grow flex flex-col">
                            <nav className="flex-1 px-2 pb-4 space-y-1">
                                <DashboardLink />
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="md:pl-64 flex flex-col flex-1">
                    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
                        <button
                            type="button"
                            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <div className="flex-1 px-4 flex justify-between">
                            <div className="flex-1 flex">
                                <form className="w-full flex md:ml-0" action="#" method="GET">
                                    <label htmlFor="search-field" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                            <SearchIcon className="h-5 w-5" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="search-field"
                                            className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                                            placeholder="Search"
                                            type="search"
                                            name="search"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="ml-4 flex items-center md:ml-6">
                                <button
                                    type="button"
                                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                </button>

                                {/* Profile dropdown */}
                                <Menu as="div" className="ml-3 relative">
                                    <div>
                                        <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                alt=""
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            test
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <main className="flex-1">
                        <div className="py-6">
                            <div className="bg-white">
                                <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Order Detail</h1>

                                    <div className="bg-white">
                                        {
                                            order &&
                                                order !== null &&
                                                order !== undefined &&
                                                order.order_items.length !== 0 ?
                                                (
                                                    <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                                                        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
                                                            <section aria-labelledby="cart-heading" className="lg:col-span-7">
                                                                <h2 id="cart-heading" className="">
                                                                    {ShowItems()}
                                                                </h2>
                                                                <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                                                                </ul>
                                                            </section>
                                                            <section
                                                                aria-labelledby="summary-heading"
                                                                className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
                                                            >
                                                                <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                                                                    Order detail summary
                                                                </h2>

                                                                <dl className="mt-6 space-y-4">
                                                                    <div className="border-t flex items-center justify-between">
                                                                        <dt className="font-medium text-gray-900">Billing address</dt>
                                                                        <dd className="mt-3 text-gray-500">
                                                                            <span className="block">{order.address_line_1}</span>
                                                                            <span className="block">{order.address_line_2}</span>
                                                                        </dd>
                                                                    </div>
                                                                    <div className="border-t flex items-center justify-between">
                                                                        <dt className="text-gray-600">OrderID</dt>
                                                                        <dd className="font-medium text-gray-900">{order.transaction_id}</dd>
                                                                    </div>
                                                                    <div className="border-t flex items-center justify-between">
                                                                        <dt className="text-gray-600">status</dt>
                                                                        <dd className="font-medium text-gray-900">{order.status}</dd>
                                                                    </div>

                                                                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                                                        <dt className="flex items-center text-sm text-gray-600">
                                                                            <span>Shipping price</span>
                                                                        </dt>
                                                                        <dd className="text-sm font-medium text-gray-900">${order.shipping_price}</dd>
                                                                    </div>
                                                                    <div className="border-t flex items-center justify-between">
                                                                        <dt className="text-gray-600">Tax</dt>
                                                                        <dd className="font-medium text-gray-900">$0.18</dd>
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
                                                                        <dd className="text-base font-medium text-gray-900">${order.amount}</dd>
                                                                    </div>
                                                                </dl>

                                                                <div className="mt-6">
                                                                </div>
                                                            </section>
                                                        </div>
                                                    </div>
                                                ) :
                                                (<></>)
                                        }
                                    </div>


                                </div>
                            </div>


                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    order: state.Orders.order,
    isAuthenticated: state.Auth.isAuthenticated,
    user: state.Auth.user,


})

export default connect(mapStateToProps, {
    get_items,
    get_total,
    get_item_total,
    get_order_detail,
})(DashboardPaymentsDetail)
