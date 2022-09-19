
import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { countries } from "../../helpers/fixCountries";
import DashboardLink from "../../components/dashboard/DashboardLink";


import { TailSpin } from "react-loader-spinner";
import { user_profile_update } from "../../redux/actions/profile"


import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    BellIcon,
    HomeIcon,
    MenuAlt2Icon,
    XIcon,
} from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'

import { toast } from "react-toastify";



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const DashboardProfile = ({
    profile,
    user_profile_update,
    isAuthenticated,
    user

}) => {

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    // const [auth, setAuth] = useState(false)    

    const [formData, setFormData] = useState({
        address_line_1: '',
        address_line_2: '',
        city: '',
        state_province_region: '',
        zipcode: '',
        phone: '',
        country_region: 'Canada'

    })

    const {
        address_line_1,
        address_line_2,
        city,
        state_province_region,
        zipcode,
        phone,
        country_region,
    } = formData


    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true)
        user_profile_update(
            address_line_1,
            address_line_2,
            city,
            state_province_region,
            zipcode,
            phone,
            country_region
        );
        setLoading(false)
        toast.success("Perfil se ha actualizado")
        window.scrollTo(0, 0)
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
                                            Siuu
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <main className="flex-1">
                        <div className="py-6">
                            <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
                                <form onSubmit={e => onSubmit(e)} className="max-w-3xl mx-auto">
                                    <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Profile</h3>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="address_line_1" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Address line 1
                                        </label>
                                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                                            <div className="max-w-lg flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="address_line_1"
                                                    placeholder={`${profile.address_line_1}`}
                                                    onChange={e => onChange(e)}
                                                    value={address_line_1}
                                                    required
                                                    autoComplete="address_line_1"
                                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="address_line_2" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Address line 2
                                        </label>
                                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                                            <div className="max-w-lg flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="address_line_2"
                                                    placeholder={`${profile.address_line_2}`}
                                                    onChange={e => onChange(e)}
                                                    value={address_line_2}
                                                    required
                                                    autoComplete="address_line_2"
                                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            City
                                        </label>
                                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                                            <div className="max-w-lg flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="city"
                                                    placeholder={`${profile.city}`}
                                                    onChange={e => onChange(e)}
                                                    value={city}
                                                    required
                                                    autoComplete="city"
                                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="state_province_region" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            State/Province
                                        </label>
                                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                                            <div className="max-w-lg flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="state_province_region"
                                                    placeholder={`${profile.state_province_region}`}
                                                    onChange={e => onChange(e)}
                                                    value={state_province_region}
                                                    required
                                                    autoComplete="state_province_region"
                                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Postal code
                                        </label>
                                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                                            <div className="max-w-lg flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="zipcode"
                                                    placeholder={`${profile.zipcode}`}
                                                    onChange={e => onChange(e)}
                                                    value={zipcode}
                                                    required
                                                    autoComplete="zipcode"
                                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Phone
                                        </label>
                                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                                            <div className="max-w-lg flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    placeholder={`${profile.phone}`}
                                                    onChange={e => onChange(e)}
                                                    value={phone}
                                                    required
                                                    autoComplete="phone"
                                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-md sm:text-sm border-gray-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label htmlFor="country_region" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                            Country/Region:
                                        </label>
                                        <div className="mt-1 sm:mt-0 sm:col-span-2">
                                            <select
                                                id="country_region"
                                                name="country_region"
                                                onChange={e => onChange(e)}
                                                required
                                                className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-500 rounded">
                                                <option value={country_region}>{profile.country_region}</option>
                                                {
                                                    countries &&
                                                    countries !== null &&
                                                    countries !== undefined &&
                                                    countries.map((country, index) => (
                                                        <option key={index} value={country.name}>{country.name}</option>

                                                    ))
                                                }


                                            </select>
                                        </div>
                                    </div>

                                    {
                                        loading ?
                                            <button
                                                className="inline-flex mt-4 float-right items-center px-4 py-3 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                <TailSpin
                                                    height="40"
                                                    width="40"
                                                    color="#882DAC"
                                                    ariaLabel="tail-spin-loading"
                                                    radius="1"
                                                    wrapperStyle={{}}
                                                    wrapperClass=""
                                                    visible={true}
                                                />
                                            </button> :
                                            <button
                                                type="submit"
                                                className="inline-flex mt-4 float-right items-center px-4 py-3 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                Guardar
                                            </button>

                                    }





                                </form >
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.Auth.isAuthenticated,
    user: state.Auth.user,
    profile: state.Profile.profile

})

export default connect(mapStateToProps, {
    user_profile_update,
})(DashboardProfile)
