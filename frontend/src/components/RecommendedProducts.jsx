import React from 'react';
import ProductCards from '../pages/shop/ProductCards';

const RecommendedProducts = ({ products, title = "Gợi ý cho bạn", loading = false }) => {
    if (loading) return (
        <section className="section__container mt-12">
            <h2 className="section__header">{title}</h2>
            <p className="text-center">Đang tải gợi ý...</p>
        </section>
    );

    if (!products || products.length === 0) return null;

    return (
        <section className="section__container mt-12">
            <h2 className="section__header">{title}</h2>
            <p className="section__subheader mb-12">
                Dựa trên sở thích và hành vi của bạn, chúng tôi đề xuất những sản phẩm sau.
            </p>
            <ProductCards products={products} />
        </section>
    );
};

export default RecommendedProducts;
