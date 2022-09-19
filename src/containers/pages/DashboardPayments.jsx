import moment from "moment"
import { connect } from "react-redux";
import { list_orders } from "../../redux/actions/orders";
import DashboardLink from "../../components/dashboard/DashboardLink";

import {
    get_items,
    get_total,
    get_item_total,
} from "../../redux/actions/cart"
import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {    
    BellIcon,            
    HomeIcon,    
    MenuAlt2Icon,    
    XIcon,
} from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const DashboardPayments = ({
    list_orders,
    get_items,
    get_total,
    get_item_total,
    orders,
    isAuthenticated,
    user

}) => {

    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        get_items()
        get_total()
        get_item_total()
        list_orders()
    }, [])

    if (!isAuthenticated) {
        return <Navigate to="/signin" />
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
                                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Order Details</h1>
                                    <div className="mt-8">
                                        <h2 className="sr-only">Products purchased</h2>

                                        <div className="space-y-4">
                                            {orders.map((product, index) => (
                                                <>
                                                    <div key={index} className="text-sm border-b border-gray-200 mt-2 sm:flex sm:justify-between">
                                                        <dl className="flex">
                                                            <dt className="text-gray-500">Order number:&nbsp;</dt>
                                                            <dd className="font-medium text-gray-900">{product.transaction_id}</dd>
                                                            <dt>
                                                                <span className="text-gray-400 mx-2" aria-hidden="true">
                                                                    &middot;
                                                                </span>
                                                                <span className="font-medium text-gray-900"> Purchase on:&nbsp;</span>
                                                            </dt>
                                                            <dd className="font-medium text-gray-900">
                                                                <time dateTime={moment(product.date_issued).fromNow()}> {moment(product.date_issued).fromNow()}</time>
                                                            </dd>
                                                        </dl>
                                                        <div className="mt-4 sm:mt-0">
                                                            <Link to={`/dashboard/payment/${product.transaction_id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                Order details<span aria-hidden="true"> &rarr;</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div
                                                        key={product.id}
                                                        className="grid grid-cols-1 text-sm sm:grid-rows-1 sm:grid-cols-12 sm:gap-x-6 md:gap-x-8 lg:gap-x-8"
                                                    >
                                                        <div className="mt-6 sm:col-span-7 sm:mt-0 md:row-end-1">
                                                            <h3 className="text-lg font-medium text-gray-900">
                                                                <Link to={`product/${product.id}`}>{product.name}</Link>
                                                            </h3>
                                                            <p className="font-medium text-gray-900 mt-1">{product.price}</p>
                                                            <p className="text-gray-500 mt-3">{product.description}</p>
                                                        </div>
                                                        <div className="sm:col-span-12 md:col-span-7">
                                                            <dl className="grid grid-cols-1 gap-y-8 border-b py-8 border-gray-200 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
                                                                <div>
                                                                    <dt className="font-medium text-gray-900">Delivery address</dt>
                                                                    <dd className="mt-3 text-gray-500">
                                                                        <span className="block">{product.address_line_1}</span>
                                                                        <span className="block">{product.address_line_2}</span>
                                                                    </dd>
                                                                </div>
                                                                <div>
                                                                    <dt className="font-medium text-gray-900">Shipping price</dt>
                                                                    <dd className="mt-2 text-gray-500 space-y-3">
                                                                        <p>${product.shipping_price}</p>
                                                                    </dd>
                                                                    <br></br>
                                                                    <dt className="font-medium text-gray-900">Total Cost</dt>
                                                                    <dd className="mt-2 text-gray-500 space-y-3">
                                                                        <p>${product.amount} </p>
                                                                    </dd>

                                                                </div>
                                                            </dl>
                                                            <p className="font-medium text-gray-900 mt-6 md:mt-10">
                                                                Status: {product.status} Created on  <time dateTime={product.datetime}>{moment(product.date_issued).fromNow()}</time>
                                                            </p>
                                                            <div className="mt-6">
                                                                <div className="bg-gray-200 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-2 bg-indigo-600 rounded-full"
                                                                        style={{ width: `calc((${product.step} * 2 + 1) / 8 * 100%)` }}
                                                                    />
                                                                </div>
                                                                <div className="hidden sm:grid grid-cols-6 font-medium text-gray-600 mt-6">
                                                                    <div className="text-indigo-600">Order placed</div>
                                                                    <div className={classNames(product.status === 'not_processed' ? 'text-indigo-600' : '', 'text-center')}>
                                                                        Processing
                                                                    </div>
                                                                    <div className={classNames(product.status === 'processed' ? 'text-indigo-600' : '', 'text-center')}>
                                                                        Processed
                                                                    </div>
                                                                    <div className={classNames(product.status === 'shipping' ? 'text-indigo-600' : '', 'text-right')}>
                                                                        Shipping
                                                                    </div>
                                                                    <div className={classNames(product.status === 'delivered' ? 'text-indigo-600' : '', 'text-right')}>
                                                                        Delivered
                                                                    </div>
                                                                    <div className={classNames(product.status === 'cancelled' ? 'text-indigo-600' : '', 'text-right')}>
                                                                        Cancelled
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Billing */}
                                    {/* <div className="mt-24">
                        <h2 className="sr-only">Billing Summary</h2>

                        <div className="bg-gray-50 rounded-lg py-6 px-6 lg:px-0 lg:py-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
                            <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:pl-8 lg:col-span-5">
                                <div>
                                    <dt className="font-medium text-gray-900">Billing address</dt>
                                    <dd className="mt-3 text-gray-500">
                                        <span className="block">Floyd Miles</span>
                                        <span className="block">7363 Cynthia Pass</span>
                                        <span className="block">Toronto, ON N3Y 4H8</span>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-900">Payment information</dt>
                                    <dd className="mt-3 flex">
                                        <div>
                                            <svg
                                                aria-hidden="true"
                                                width={36}
                                                height={24}
                                                viewBox="0 0 36 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-auto"
                                            >
                                                <rect width={36} height={24} rx={4} fill="#224DBA" />
                                                <path
                                                    d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                                                    fill="#fff"
                                                />
                                            </svg>
                                            <p className="sr-only">Visa</p>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-gray-900">Ending with 4242</p>
                                            <p className="text-gray-600">Expires 02 / 24</p>
                                        </div>
                                    </dd>
                                </div>
                            </dl>

                            <dl className="mt-8 divide-y divide-gray-200 text-sm lg:mt-0 lg:pr-8 lg:col-span-7">
                                <div className="pb-4 flex items-center justify-between">
                                    <dt className="text-gray-600">Subtotal</dt>
                                    <dd className="font-medium text-gray-900">$72</dd>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-gray-600">Shipping</dt>
                                    <dd className="font-medium text-gray-900">$5</dd>
                                </div>
                                <div className="py-4 flex items-center justify-between">
                                    <dt className="text-gray-600">Tax</dt>
                                    <dd className="font-medium text-gray-900">$6.16</dd>
                                </div>
                                <div className="pt-4 flex items-center justify-between">
                                    <dt className="font-medium text-gray-900">Order total</dt>
                                    <dd className="font-medium text-indigo-600">$83.16</dd>
                                </div>
                            </dl>
                        </div>
                    </div> */}
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
    orders: state.Orders.orders,
    isAuthenticated: state.Auth.isAuthenticated,
    user: state.Auth.user,
    orders: state.Orders.orders

})

export default connect(mapStateToProps, {
    list_orders,
    get_items,
    get_total,
    get_item_total,
})(DashboardPayments)
