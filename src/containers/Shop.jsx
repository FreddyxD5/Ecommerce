import Layout from "../hocs/layout";
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { FilterIcon, MinusSmIcon, PlusSmIcon } from '@heroicons/react/solid'

import { connect } from "react-redux"
import { get_categories } from "../redux/actions/categories";
import { get_products, get_filtered_products } from "../redux/actions/products";
import ProductCart from "../components/product/ProductCart";
import { prices } from "../helpers/fixedPrices";



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Shop = ({
    get_categories, categories,
    get_products, products,
    get_filtered_products, filtered_products
}) => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [filtered, setFiltered] = useState(false)
    const [formData, setFormData] = useState({
        category_id: '0',
        price_range: 'Any',
        sortBy: 'created',
        order: 'desc'

    })

    const { category_id, price_range, sortBy, order } = formData    

    useEffect(() => {
        get_categories();
        get_products();
        get_filtered_products();
        window.scrollTo(0, 0)
    }, [])

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = e => {
        e.preventDefault();
        get_filtered_products(category_id, price_range, sortBy, order)
        setFiltered(true)
        
    }

    const showProducts = () => {
        let results = []
        let display = []
        if (
            filtered_products &&
            filtered_products !== null &&
            filtered_products !== undefined &&
            filtered


        ) {
            filtered_products.map((product, index) => {
                return display.push(
                    <div key={index}>
                        <ProductCart product={product} />                    
                    </div>
                )
            })
        } else if (
            !filtered &&
            products &&
            products !== null &&
            products !== undefined
        ) {
            products.map((product, index) => {
                return display.push(
                    <div key={index}>
                        <ProductCart product={product} />
                    </div>
                )
            })
        }

        for (let i = 0; i < display.length; i += 3) {
            results.push(
                <div key={i} className='grid md:grid-cols-3'>
                    {display[i] ? display[i] : <div className=""></div>}
                    {display[i + 1] ? display[i + 1] : <div className=""></div>}
                    {display[i + 2] ? display[i + 2] : <div className=""></div>}
                </div>
            )
        }

        return results
    }


    return (
        <Layout>
            <div className="bg-white">
                <div>
                    {/* Mobile filter dialog */}
                    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                        <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                            <Transition.Child
                                as={Fragment}
                                enter="transition-opacity ease-linear duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity ease-linear duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                            </Transition.Child>

                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
                                    <div className="px-4 flex items-center justify-between">
                                        <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
                                        <button
                                            type="button"
                                            className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                                            onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <XIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    {/* MOBILE Filters */}
                                    <form onSubmit={e => onSubmit(e)} className="mt-4 border-t border-gray-200">
                                        <h3 className="sr-only">Categories</h3>
                                        <ul role="list" className="font-medium text-gray-900 px-2 py-3">
                                            {
                                                categories &&
                                                categories !== null &&
                                                categories !== undefined &&
                                                categories.map(category => {
                                                    if (category.sub_categories.length === 0) {
                                                        return (
                                                            <div key={category.id} className="flex items-center h-5 my-5">
                                                                <input
                                                                    name='category_id'
                                                                    type='radio'
                                                                    onChange={e => onChange(e)}
                                                                    value={category.id.toString()}
                                                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600"
                                                                />                                                                
                                                                <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                                                    {category.name}
                                                                </label>

                                                            </div>
                                                        )
                                                    } else {
                                                        let result = []
                                                        result.push(
                                                            <div key={category.id} className="flex items-center h-5 ml-2 my-5">
                                                                <input
                                                                    name='category_id'
                                                                    type='radio'
                                                                    onChange={e => onChange(e)}
                                                                    value={category.id.toString()}
                                                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600"
                                                                />
                                                                <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                                                    {category.name}
                                                                </label>
                                                            </div>
                                                        )

                                                        category.sub_categories.map(sub_category => {
                                                            result.push(
                                                                <div key={sub_category.id} className="flex items-center h-5 ml-2 my-5">
                                                                    <input
                                                                        name='category_id'
                                                                        type='radio'
                                                                        onChange={e => onChange(e)}
                                                                        value={sub_category.id.toString()}
                                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded-full"
                                                                    />                                                                    
                                                                    <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                                                        {sub_category.name}
                                                                    </label>

                                                                </div>
                                                            )
                                                        })

                                                        return result
                                                    }
                                                })

                                            }
                                        </ul>
                                        <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                                            {({ open }) => (
                                                <>
                                                    <h3 className="-mx-2 -my-3 flow-root"></h3>
                                                    <Disclosure.Button className="px-2 py-3 bg-white w-full flex items-denter justify-between  text-gray-400 hover:text-gray-500">
                                                        <span className="font-sofiapro-regular text-gray-900">Prices</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="pt-6">
                                                        <div className="space-y-6">
                                                            {prices && prices.map(
                                                                (price, index) => {
                                                                    if (price.id === 0) {
                                                                        return (
                                                                            <div key={index}>
                                                                                <input
                                                                                    onChange={e => onChange(e)}
                                                                                    value={price.name}
                                                                                    name='price_range'
                                                                                    type='radio'
                                                                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded-full"
                                                                                    defaultChecked
                                                                                />
                                                                                <label className="ml-3 min-w-0 flex-1 text-gray-500 font-sofiapro-light">{price.name}</label>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <div key={index} className='form-check'>
                                                                                <input
                                                                                    onChange={e => onChange(e)}
                                                                                    value={price.name}
                                                                                    name='price_range'
                                                                                    type='radio'
                                                                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded-full"
                                                                                />
                                                                                <label className="ml-3 min-w-0 flex-1 text-gray-500 font-sofiapro-light">{price.name}</label>
                                                                            </div>
                                                                        )

                                                                    }
                                                                }
                                                            )
                                                            }
                                                        </div>
                                                    </Disclosure.Panel>

                                                </>
                                            )}
                                        </Disclosure>

                                        <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                                            {({ open }) => (
                                                <>
                                                    <h3 className="-mx-2 -my-3 flow-root"></h3>
                                                    <Disclosure.Button className="px-2 py-3 bg-white w-full flex items-denter justify-between  text-gray-400 hover:text-gray-500">
                                                        <span className="font-sofiapro-regular text-gray-900">Más filtros</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="pt-6">
                                                        <div className="space-y-6">
                                                           <div className="form-group">
                                                            <label htmlFor="sortby" className="mr-3 min-w-0 flex-1 text-gray-600"> Ver por</label>
                                                            <select
                                                                className="my-2 font-sofiapro-light inline-flex justify-between"
                                                                id='order'
                                                                name='order'
                                                                onChange={e=>onChange(e)}
                                                                value={order}
                                                                >
                                                                    <option value='date_created'>Fecha</option>
                                                                    <option value='price'>Precio</option>
                                                                    <option value='sold'>Sold</option>
                                                                    <option value='name'>Nombre</option>

                                                            </select>
                                                           </div>
                                                           <div className="form-group">
                                                            <label htmlFor="sortby" className="mr-3 min-w-0 flex-1 text-gray-600">Ordenar por</label>
                                                            <select
                                                                className="my-2 font-sofiapro-light inline-flex justify-between"
                                                                id='sortBy'
                                                                name='sortBy'
                                                                onChange={e=>onChange(e)}
                                                                value={sortBy}
                                                                >
                                                                    <option value='asc'>A - Z</option>
                                                                    <option value='desc'>Z - A</option>
                                                                    

                                                            </select>
                                                           </div>
                                                        </div>
                                                    </Disclosure.Panel>

                                                </>
                                            )}
                                        </Disclosure>
                                        <button      
                                        type="submit"
                                        className="float-right inline-flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Aplicar filtros 
                                        </button>
                                    </form>
                                </div>
                            </Transition.Child>
                        </Dialog>
                    </Transition.Root>

                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative z-10 flex items-baseline justify-between pt-24 pb-6 border-b border-gray-200">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Productos</h1>

                            <div className="flex items-center">
                                
                                <button
                                    type="button"
                                    className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    <span className="sr-only">Filters</span>
                                    <FilterIcon className="w-5 h-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <section aria-labelledby="products-heading" className="pt-6 pb-24">
                            <h2 id="products-heading" className="sr-only">
                                Products
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
                                {/* Filters */}
                                <form className="hidden lg:block" onSubmit={e=> onSubmit(e)}>
                                    <h3 className="sr-only">Categories</h3>
                                    <ul role="list" className="text-sm font-medium text-gray-900 space-y-4 pb-6 border-b border-gray-200">
                                        {
                                            categories &&
                                            categories !== null &&
                                            categories !== undefined &&
                                            categories.map(category => {
                                                if (category.sub_categories.length === 0) {
                                                    return (
                                                        <div key={category.id} className="flex items-center h-5 my-5">
                                                            <input
                                                                name='category_id'
                                                                type='radio'
                                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600"
                                                            />                                                            
                                                            <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                                                {category.name}
                                                            </label>

                                                        </div>
                                                    )
                                                } else {
                                                    let result = []
                                                    result.push(
                                                        <div key={category.id} className="flex items-center h-5">
                                                            <input
                                                                name='category_id'
                                                                type='radio'
                                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600"
                                                            />                                                          
                                                            <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                                                {category.name}
                                                            </label>
                                                        </div>
                                                    )

                                                    category.sub_categories.map(sub_category => {
                                                        result.push(
                                                            <div key={sub_category.id} className="flex items-center h-5 ml-2 my-5">
                                                                <input
                                                                    name='category_id'
                                                                    type='radio'
                                                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600"
                                                                />                                                                
                                                                <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                                                    {sub_category.name}
                                                                </label>

                                                            </div>
                                                        )
                                                    })

                                                    return result
                                                }
                                            })

                                        }
                                    </ul>

                                    <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                                            {({ open }) => (
                                                <>
                                                    <h3 className="-mx-2 -my-3 flow-root"></h3>
                                                    <Disclosure.Button className="px-2 py-3 bg-white w-full flex items-denter justify-between  text-gray-400 hover:text-gray-500">
                                                        <span className="font-sofiapro-regular text-gray-900">Prices</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="pt-6">
                                                        <div className="space-y-6">
                                                            {prices && prices.map(
                                                                (price, index) => {
                                                                    if (price.id === 0) {
                                                                        return (
                                                                            <div key={index}>
                                                                                <input
                                                                                    onChange={e => onChange(e)}
                                                                                    value={price.name}
                                                                                    name='price_range'
                                                                                    type='radio'
                                                                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded-full"
                                                                                    defaultChecked
                                                                                />
                                                                                <label className="ml-3 min-w-0 flex-1 text-gray-500 font-sofiapro-light">{price.name}</label>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <div key={index} className='form-check'>
                                                                                <input
                                                                                    onChange={e => onChange(e)}
                                                                                    value={price.name}
                                                                                    name='price_range'
                                                                                    type='radio'
                                                                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded-full"
                                                                                />
                                                                                <label className="ml-3 min-w-0 flex-1 text-gray-500 font-sofiapro-light">{price.name}</label>
                                                                            </div>
                                                                        )

                                                                    }
                                                                }
                                                            )
                                                            }
                                                        </div>
                                                    </Disclosure.Panel>

                                                </>
                                            )}
                                        </Disclosure>

                                        <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                                            {({ open }) => (
                                                <>
                                                    <h3 className="-mx-2 -my-3 flow-root"></h3>
                                                    <Disclosure.Button className="px-2 py-3 bg-white w-full flex items-denter justify-between  text-gray-400 hover:text-gray-500">
                                                        <span className="font-sofiapro-regular text-gray-900">Más filtros</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="pt-6">
                                                        <div className="space-y-6">
                                                           <div className="form-group">
                                                            <label htmlFor="sortby" className="mr-3 min-w-0 flex-1 text-gray-600"> Ver por</label>
                                                            <select
                                                                className="my-2 font-sofiapro-light inline-flex justify-between"
                                                                id='order'
                                                                name='order'
                                                                onChange={e=>onChange(e)}
                                                                value={order}
                                                                >
                                                                    <option value='date_created'>Fecha</option>
                                                                    <option value='price'>Precio</option>
                                                                    <option value='sold'>Sold</option>
                                                                    <option value='name'>Nombre</option>

                                                            </select>
                                                           </div>
                                                           <div className="form-group">
                                                            <label htmlFor="sortby" className="mr-3 min-w-0 flex-1 text-gray-600">Ordenar por</label>
                                                            <select
                                                                className="my-2 font-sofiapro-light inline-flex justify-between"
                                                                id='sortBy'
                                                                name='sortBy'
                                                                onChange={e=>onChange(e)}
                                                                value={sortBy}
                                                                >
                                                                    <option value='asc'>A - Z</option>
                                                                    <option value='desc'>Z - A</option>
                                                                    

                                                            </select>
                                                           </div>
                                                        </div>
                                                    </Disclosure.Panel>

                                                </>
                                            )}
                                        </Disclosure>
                                        <button      
                                        type="submit"
                                        className="float-right inline-flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Aplicar filtros 
                                        </button>
                                </form>

                                {/* Product grid */}
                                <div className="lg:col-span-3">
                                    {/* Replace with your content */}
                                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 lg:h-full" >
                                        <div className="bg-white">
                                            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">                                                

                                                {products && showProducts()}

                                            </div>
                                        </div>
                                    </div>
                                    {/* /End replace */}
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </Layout>
    )
}
const mapStateToProps = state => ({
    categories: state.Categories.categories,
    products: state.Products.products,
    filtered_products: state.Products.filtered_products
})

export default connect(mapStateToProps, {
    get_categories,
    get_products,
    get_filtered_products
})(Shop);