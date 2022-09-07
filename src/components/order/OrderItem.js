import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { CheckIcon, ClockIcon, QuestionMarkCircleIcon, XIcon } from '@heroicons/react/solid'
import { useEffect, useState } from "react";
import { UploadIcon } from "@heroicons/react/outline";
import { setAlert } from "../../redux/actions/alert";


const OrderItem = ({
    item,     
    render,
    setRender,
    setAlert,
}) => {
              

    return (
        <li className="flex py-6 sm:py-10">
            <div className="flex-shrink-0">
                <img
                    src={item.product.image}
                    alt={item.name}
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

})(OrderItem);
