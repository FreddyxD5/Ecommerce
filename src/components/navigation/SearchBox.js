import { SearchIcon } from "@heroicons/react/outline";
import { Navigate } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import {connect} from "react-redux"

const SearchBox = ({
    categories,
    search,
    onChange,
    onSubmit}) => {       

    return (
        <>
        <form onSubmit={e=>onSubmit(e)}>
        <div href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
            <div className="mt-1 flex rounded-md shadow-sm border border-gray-200">
                <div className="mt-1 mx-1 ">
                    <select     
                    onChange={e=>onChange(e)}
                    name='category_id'
                    className="rounded-full"
                    >
                        <option value={0}>All</option>
                        {
                            categories &&
                            categories !== null &&
                            categories !== undefined &&
                            categories.map((category, index)=>(
                                <option 
                                key={index}
                                value={category.id}>{category.name}</option>
                            ))
                        }


                    </select>

                </div>
                <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <input
                        type="search"
                        name="search"
                        onChange={e=>onChange(e)}
                        value={search}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-2 sm:text-sm border-gray-300"
                        placeholder="Que estas buscando?"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"                    
                >
                    <SearchIcon className='h-5 w-5 text-gray-400' aria-hidden="true"></SearchIcon>
                </button>
            </div>
        </div>
        </form>
        </>
    )
}
const mapStateProps = state =>({    
    
})

export default connect(mapStateProps,{

})(SearchBox);