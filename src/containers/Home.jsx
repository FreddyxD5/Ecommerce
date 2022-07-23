import { useEffect, useState } from "react";
import Layout from "../hocs/layout";
import {connect} from "react-redux"
import Banner from "../components/home/Banner"
import ProductsArrival from "../components/home/ProductsArrival";
import ProductsSold from "../components/home/ProductsSold";

import {
    get_products_by_arrival,
    get_products_by_sold
} from "../redux/actions/products"


const Home = ({
    get_products_by_arrival,
    get_products_by_sold,
    products_arrival,
    products_sold
}) =>{
    useEffect(()=>{
        window.scroll(0,0)
        get_products_by_arrival();
        get_products_by_sold();
    },[])

    return (
        <Layout>
            <div className="text-blue-500">
                <Banner></Banner>
                <ProductsArrival data={products_arrival}></ProductsArrival>
                <ProductsSold data={products_sold}></ProductsSold>
            </div>
        </Layout>
    )
}



const mapStateToProps = state =>({
    products_arrival:state.Products.products_arrival,
    products_sold: state.Products.products_sold
})
 
export default connect(mapStateToProps,{
    get_products_by_arrival,
    get_products_by_sold
})(Home);