import React from 'react'
import RatingStars from '../../components/RatingStars'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import fallbackProductImage from '../../assets/card-1.png';


const ProductCards = ({ products }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        if (product.stock === 0) {
            alert("Sản phẩm này đã hết hàng!");
            return;
        }
        dispatch(addToCart(product))
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
                <div key={index} className="product__card">
                    <div className='relative'>
                        <Link to={`/shop/${product._id}`}>
                            <img
                                src={product.image}
                                alt={product.name}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = fallbackProductImage;
                                }}
                                className='max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300'
                            />
                        </Link>

                        {product.stock === 0 && (
                            <div className='absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded'>
                                Hết hàng
                            </div>
                        )}

                        <div className='hover:block absolute top-3 right-3'>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product)
                                }}
                                disabled={product.stock === 0}
                                className={product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                            >
                                < i className={`ri-shopping-cart-2-line bg-primary p-1.5 text-white ${product.stock === 0 ? '' : 'hover:bg-primary-dark'}`}></i>
                            </button>
                        </div>
                    </div>
                    <div className="product__card__content">
                        <h4>{product.name}</h4>
                        <p>{new Intl.NumberFormat('vi-VN').format(product.price)} đ {product.oldPrice ? <s>{new Intl.NumberFormat('vi-VN').format(product.oldPrice)} đ</s> : null}</p>
                        <div className="flex items-center justify-between mt-2">
                             <RatingStars rating={product.rating} />
                             <span className="text-xs text-gray-500">Đã bán: {product.totalSold || 0}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductCards
