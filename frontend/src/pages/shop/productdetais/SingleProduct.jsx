import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetchProductByIdQuery, useGetProductRecommendationsQuery } from '../../../redux/features/products/productsApi';
import RatingStars from '../../../components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';
import RecommendedProducts from '../../../components/RecommendedProducts';
import fallbackProductImage from '../../../assets/card-1.png';

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Fetch product by ID using the hook
    const { data, error, isLoading } = useFetchProductByIdQuery(id);

    // Destructure and rename fields for clarity
    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || [];
    // console.log(productReviews)

    const categoryLabels = {
        'ao-nam-phong': 'Áo phông nam',
        'ao-nam-polo': 'Polo nam',
        'ao-nam-so-mi-dai': 'Sơ mi dài nam',
        'ao-nam-so-mi-ngan': 'Sơ mi ngắn nam',
        'quan-nam-au': 'Quần âu nam',
        'quan-nam-jeans': 'Quần jeans nam',
        'quan-nam-kaki': 'Quần kaki nam',
        'quan-nam-jogger': 'Quần jogger nam',
        'giay-dep-nam': 'Giày dép nam',
        'mu-nam': 'Mũ nam',
        'vi-da-nam': 'Ví da nam',
        'that-lung-nam': 'Thắt lưng nam',
        'vong-co': 'Vòng cổ',
        'nuoc-hoa': 'Nước hoa'
    };

    const colorLabels = {
        'black': 'Đen',
        'white': 'Trắng',
        'gray': 'Xám',
        'navy': 'Xanh than',
        'brown': 'Nâu',
        'beige': 'Be',
        'olive': 'Xanh rêu',
        'burgundy': 'Đỏ đô'
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (isLoading) return <p>Đang tải chi tiết sản phẩm...</p>;
    if (error) return <p>Lỗi khi tải chi tiết sản phẩm.</p>;

    return (
        <>
            <section className="section__container rounded bg-primary-light">
                <h2 className="section__header">Chi tiết sản phẩm</h2>
                <div className="section__subheader space-x-2">
                    <span className='hover:text-primary'><Link to="/">Trang chủ</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'><Link to="/shop">Cửa hàng</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary text-gray-500'>{singleProduct.name}</span>
                </div>
            </section>

            <section className="section__container mt-8">
                <div className="flex flex-col items-center md:flex-row gap-8">
                    {/* Product Image */}
                    <div className="w-full md:w-5/12">
                        <img
                            src={singleProduct.image}
                            alt={singleProduct.name}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = fallbackProductImage;
                            }}
                            className="rounded-md w-full h-auto shadow-md"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="w-full md:w-7/12">
                        <h3 className="text-2xl font-semibold mb-4">{singleProduct.name}</h3>
                        <p className="text-xl text-primary mb-4">
                            {new Intl.NumberFormat('vi-VN').format(singleProduct.price)} đ {singleProduct.oldPrice && <s className="text-gray-400 ml-2">{new Intl.NumberFormat('vi-VN').format(singleProduct.oldPrice)} đ</s>}
                        </p>
                        <p className="text-gray-700 mb-4">{singleProduct.description}</p>

                        {/* Additional Product Information */}
                        <div className="flex flex-col space-y-2">
                            <p><strong>Danh mục:</strong> {categoryLabels[singleProduct.category] || singleProduct.category}</p>
                            <p><strong>Màu sắc:</strong> {colorLabels[singleProduct.color] || singleProduct.color}</p>
                            <div className='flex gap-1 items-center'>
                                <strong>Đánh giá:</strong>
                                <RatingStars rating={singleProduct.rating} />
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={(e) => {

                                e.stopPropagation();
                                handleAddToCart(singleProduct)
                            }}
                            className="mt-6 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </section>

            {/* Display Reviews */}
            <section className="section__container mt-8">
                <ReviewsCard productReviews={productReviews} />
            </section>

            {/* Hybrid Recommendations */}
            <ProductRecommendations productId={id} />
        </>
    );
};

// Sub-component for Recommendations to manage its own query
const ProductRecommendations = ({ productId }) => {
    const { data, isLoading } = useGetProductRecommendationsQuery(productId);
    const recommendations = data?.recommendations || [];

    return (
        <RecommendedProducts 
            products={recommendations} 
            loading={isLoading} 
            title="Sản phẩm bạn có thể thích"
        />
    );
};

export default SingleProduct;
