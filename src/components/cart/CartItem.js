import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { CheckIcon, ClockIcon, QuestionMarkCircleIcon, XIcon } from '@heroicons/react/solid'
import { useEffect, useState } from "react";
import { UploadIcon } from "@heroicons/react/outline";
const products = [
    {
        id: 1,
        name: 'Basic Tee',
        href: '#',
        price: '$32.00',
        color: 'Sienna',
        inStock: true,
        size: 'Large',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-01.jpg',
        imageAlt: "Front of men's Basic Tee in sienna.",
    },
    {
        id: 2,
        name: 'Basic Tee',
        href: '#',
        price: '$32.00',
        color: 'Black',
        inStock: false,
        leadTime: '3–4 weeks',
        size: 'Large',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-02.jpg',
        imageAlt: "Front of men's Basic Tee in black.",
    },
    {
        id: 3,
        name: 'Nomad Tumbler',
        href: '#',
        price: '$35.00',
        color: 'White',
        inStock: true,
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-01-product-03.jpg',
        imageAlt: 'Insulated bottle with white base and black snap lid.',
    },
]


const CartItem = ({
    item,
    count,
    update_item,
    remove_item,
    render,
    setRender,
    setAlert,

}) => {
    
    const [formData, setFormData] = useState({})
    const  [updateCount, setUpdateCount] = useState(false)
    const { item_count } = formData;

    useEffect(() => {
        if (count) {
            setFormData({ ...formData, item_count: count })
        }else{
            setFormData({ ...formData, item_count: 1 })
        }
    }, [count])

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setUpdateCount(!updateCount)
    };

    useEffect(()=>{
        const fetchData = async () => {
            try {
                if (item.product.quantity >= item_count) {
                    await update_item(item, item_count)
                }
                setRender(!render)

            } catch (err) {

            }
        }

        fetchData();        
    },[updateCount])

    // const onSubmit = e => {

    //     e.preventDefault();

    //     const fetchData = async () => {
    //         try {
    //             if (item.product.quantity >= item_count) {
    //                 await update_item(item, item_count)
    //             } else {
    //                 setAlert('Not enough in stock', 'red')
    //             }

    //         } catch (err) {

    //         }
    //     }

    //     fetchData();
    // }

    const removeItemHandler = async () =>{
        await remove_item(item);
        setRender(!render);

    }


    return (
        <li className="flex py-6 sm:py-10">
            <div className="flex-shrink-0">
                <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                />
            </div>

            <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                        <div className="flex justify-between">
                            <h3 className="text-sm">
                                <Link to={`/product/${item.product.id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                    {item.product.name}
                                </Link>
                            </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">{item.product.name}</p>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">{item.product.price}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                        <form >                            
                            <select
                                name='item_count'
                                onChange={(e) => onChange(e)}
                                value={item_count}
                                className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>8</option>
                            </select>                            
                        </form>

                        <div className="absolute top-0 right-0">
                            <button type="button"
                            onClick={removeItemHandler} className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Remove</span>
                                <XIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-4 flex text-sm text-gray-700 space-x-2">
                    {
                        item.product &&
                        item.product !== null &&
                        item.product !== undefined &&
                        item.product.quantity >0 ?(
                            <>
                            <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                            <span className="green">In Stock</span>
                            </>
                        ):
                        (  
                            <>
                            <ClockIcon className="flex-shrink-0 h-5 w-5 text-red-300" aria-hidden="true" />
                            <span className="red"> Out of stock</span>
                            </>
                        )
                    }                    
                </p>
            </div>
        </li>

    )
}
const mapStateToProps = state => ({

})

export default connect(mapStateToProps, {

})(CartItem);
