import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HeartIcon } from '@heroicons/react/outline'
import { connect } from "react-redux"
import { useNavigate, Navigate } from "react-router-dom";
import { Oval } from "react-loader-spinner"
import Layout from "../../hocs/layout";
import ImageGallery from "../../components/product/imageGallery";


import { get_product, get_related_products } from "../../redux/actions/products";
import StarRating from "../../components/rating/StarRating";


import {
    get_items,
    add_item,
    get_total,
    get_item_total
} from "../../redux/actions/cart"

import {
    get_product_review,
    get_product_reviews,
    add_review,
    update_review,
    delete_review,
    filter_reviews
} from "../../redux/actions/reviews";

import {
    add_wishlist_item,
    get_wishlist,
    get_wishlist_item_total,
    remove_wishlist_item,
} from "../../redux/actions/wishlist";

import WishlistHeart from "../../components/product/WishlistHeart";

const ProductDetail = ({
    isAuthenticated,
    get_product,
    get_related_products,
    product,
    cart,
    get_items,
    add_item,
    get_total,
    get_item_total,
    add_wishlist_item,
    get_wishlist,
    get_wishlist_item_total,
    remove_wishlist_item,
    wishlist,
    get_product_review,
    get_product_reviews,
    add_review,
    update_review,
    delete_review,
    filter_reviews,
    review,
    reviews
}) => {

    const params = useParams()
    const productId = params.productId
    const [loading, setLoading] = useState(false)
    let inBag = false


    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        comment: '',
        rating: '0'
    })

    const { comment, rating } = formData

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const addToCart = async () => {
        if (product && product !== null && product !== undefined && product.quantity > 0) {
            setLoading(true)
            await add_item(product);
            await get_items();
            await get_total();
            await get_item_total();
            setLoading(false)
            navigate('/cart')
        }
    }



    const addToWishlist = async () => {
        if (isAuthenticated) {
            let isPresent = false

            if (
                wishlist &&
                wishlist !== null &&
                wishlist !== undefined &&
                product &&
                product !== null &&
                product !== undefined
            ) {
                wishlist.items.map(item => {
                    if (item.product.id.toString() === product.id.toString()) {
                        isPresent = true;
                    }
                });
            }

            if (isPresent) {
                await remove_wishlist_item(product.id);
                await get_wishlist();
                await get_wishlist_item_total();
            } else {
                await remove_wishlist_item(product.id)
                await add_wishlist_item(productId)
                await get_wishlist()
                await get_wishlist_item_total()
                await get_items()
                await get_total()
                await get_item_total()
            }
        } else {
            return <Navigate to="/cart" />
        }


    }

    const showReviews = () => {
        return (
            <>
                {
                    reviews &&
                        reviews !== null &&
                        reviews !== undefined &&
                        reviews.length !== 0 ?
                        reviews.map((item, index) => {
                            return (
                                <>
                                    <div key={index} className="col-span-2 mt-4">

                                        <div class="flex items-stretch space-x-4">
                                            <img class="w-10 h-10 rounded-full" src="/docs/images/people/profile-picture-5.jpg" alt="" />
                                            <div class="font-medium">
                                                <h6 className="dark:text-gray-400">{item.user}</h6>
                                                <div class="text-sm text-black-500 dark:text-gray-600">{item.comment}</div>
                                            </div>
                                            <div className="">
                                                <StarRating
                                                    selectedStars={item.rating}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )
                        }) :
                        <h6>There's no reviews for this product yet</h6>

                }
            </>
        )
    }


    const create_review = async e => {
        e.preventDefault()
        add_review(productId, rating, comment)
        setFormData({
            comment: "",
            rating: '0'
        })
    };


    useEffect(() => {
        window.scrollTo(0, 0)
        get_product(productId);
        get_related_products(productId);
        get_wishlist()
        get_wishlist_item_total()
        get_items()
    }, [])

    useEffect(() => {
        get_product_reviews(productId)
    }, [productId])

    useEffect(() => {
        get_product_review(productId)
    }, [productId])



    if (cart && cart !== undefined && cart !== null && productId !== null && productId !== undefined) {
        cart.map(products => {
            if (products.product.id === productId) {
                inBag = true
            }
        })
    }
    return (
        <Layout>
            <div className="bg-white">
                <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                        {/* Image gallery */}
                        <ImageGallery data={product && product.image} />
                        {/* Product info */}
                        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product && product.name}</h1>

                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl text-gray-900">$ {product && product.price}</p>
                            </div>

                            {/* Reviews */}

                            <div className="mt-6">
                                <h3 className="sr-only">Description</h3>

                                <div
                                    className="text-base text-gray-700 space-y-6"
                                    dangerouslySetInnerHTML={{ __html: product && product.description }}
                                />
                            </div>
                            <div className="mt-6">
                                <div>
                                    <h3 className="text-sm text-gray-600">Color</h3>

                                    <fieldset className="mt-2">
                                        <legend className="sr-only">
                                            Choose a color
                                        </legend>
                                        <div className="flex items-center space-x-3">

                                            <label className="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-700">
                                                <input type="radio" name="color-choice" value="Washed Black" className="sr-only" aria-labelledby="color-choice-0-label" />
                                                <p id="color-choice-0-label" className="sr-only">
                                                    Washed Black
                                                </p>
                                                <span aria-hidden="true" className="h-8 w-8 bg-gray-700 border border-black border-opacity-10 rounded-full"></span>
                                            </label>

                                            <label className="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-400">
                                                <input type="radio" name="color-choice" value="White" className="sr-only" aria-labelledby="color-choice-1-label" />
                                                <p id="color-choice-1-label" className="sr-only">
                                                    White
                                                </p>
                                                <span aria-hidden="true" className="h-8 w-8 bg-white border border-black border-opacity-10 rounded-full"></span>
                                            </label>


                                            <label className="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-500">
                                                <input type="radio" name="color-choice" value="Washed Gray" className="sr-only" aria-labelledby="color-choice-2-label" />
                                                <p id="color-choice-2-label" className="sr-only">
                                                    Washed Gray
                                                </p>
                                                <span aria-hidden="true" className="h-8 w-8 bg-gray-500 border border-black border-opacity-10 rounded-full"></span>
                                            </label>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>


                            <div className="mt-6">
                                {/* Colors */}
                                <p>
                                    {
                                        product &&
                                            product !== null &&
                                            product !== undefined &&
                                            product.quantity > 0 ? (
                                            <span className="text-green-500">
                                                In stock
                                            </span>

                                        ) : (<span className="text-red-500">
                                            out Stock
                                        </span>)
                                    }
                                </p>

                                <div className="mt-6 flex sm:flex-col1">
                                    {inBag ?
                                        <button
                                            type="submit"
                                            className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                                        >
                                            Este producto ya esta en su carrito
                                        </button> :
                                        <button
                                            onClick={addToCart}
                                            type="submit"
                                            className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                                        >
                                            Agregar al carrito
                                        </button>}

                                    <WishlistHeart
                                        addToWishlist={addToWishlist}
                                        product={product}
                                        wishlist={wishlist}
                                    />
                                </div>
                            </div>

                            <section aria-labelledby="details-heading" className="mt-12">
                                <h2 id="details-heading" className="sr-only">
                                    Additional details
                                </h2>
                            </section>
                        </div>
                        <section className="my-5 max-w-7xl">
                            <div className="grid row-auto">
                                <div>
                                    {
                                        review &&
                                            review !== null &&
                                            review !== undefined ?
                                            <div>
                                                delete this shiet
                                            </div>
                                            :
                                            <>
                                                <form onSubmit={e => create_review(e)}>
                                                    <div class="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                                                        <div class="py-2 px-4 bg-white rounded-t-lg dark:bg-gray-800">
                                                            <label for="comment" class="sr-only">Your comment</label>
                                                            <textarea id="comment"
                                                                name="comment"
                                                                onChange={e => onChange(e)}
                                                                value={comment}
                                                                rows="2" cols="100" class=" resize-none px-0 w-full text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Escribe un comentario..." required=""></textarea>
                                                        </div>
                                                        <div class="flex justify-between items-center py-2 px-3 border-t dark:border-gray-600">
                                                            <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                                                Post comment
                                                            </button>
                                                            <div class="flex pl-0 space-x-1 sm:pl-2">
                                                                <StarRating></StarRating>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                                <p class="ml-auto text-xs text-gray-500 dark:text-gray-400">Remember, be kind <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline"></a>.</p>
                                            </>
                                    }


                                </div>

                                <div className="col-span-3 mt-3">
                                    {showReviews()}
                                </div>
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
    product: state.Products.product,
    cart: state.Cart.items,
    wishlist: state.Wishlist.items,
    review: state.Review.review,
    reviews: state.Review.reviews
})

export default connect(mapStateToProps, {
    get_product,
    get_related_products,
    get_items,
    add_item,
    get_total,
    get_item_total,
    add_wishlist_item,
    get_wishlist,
    get_wishlist_item_total,
    remove_wishlist_item,
    get_product_review,
    get_product_reviews,
    add_review,
    update_review,
    delete_review,
    filter_reviews,
})(ProductDetail);