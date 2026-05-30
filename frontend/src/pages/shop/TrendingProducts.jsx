import React, { useState } from 'react';
import ProductCards from './ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const TrendingProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(8);
  
  const { data: { products = [] } = {}, error, isLoading } = useFetchAllProductsQuery({
    limit: visibleProducts,
    sort: 'trending'
  });

  const loadMoreProducts = () => {
    setVisibleProducts(prevCount => prevCount + 4);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products.</div>;

  return (
    <section className="section__container product__container">
      <h2 className="section__header">Sản phẩm thịnh hành</h2>
      <p className="section__subheader mb-12">
        Khám phá những lựa chọn hot nhất: Nâng tầm phong cách của bạn với bộ sưu tập thời trang nam thịnh hành của chúng tôi.
      </p>

      {/* products card */}
      <ProductCards products={products} />

      {/* Load More button */}
      <div className="product__btn">
        {products.length >= visibleProducts && (
          <button className="btn" onClick={loadMoreProducts}>
            Xem thêm
          </button>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
