import React, { useState } from 'react';
import products from "../../data/products.json";

import ProductCards from './ProductCards';

const TrendingProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(8);

  const loadMoreProducts = () => {
    setVisibleProducts(prevCount => prevCount + 4);
  };

  return (
    <section className="section__container product__container">
      <h2 className="section__header">Sản phẩm thịnh hành</h2>
      <p className="section__subheader mb-12">
        Khám phá những lựa chọn hot nhất: Nâng tầm phong cách của bạn với bộ sưu tập thời trang nam thịnh hành của chúng tôi.
      </p>

      {/* products card */}
      <ProductCards products={products.slice(0, visibleProducts)} />

      {/* Load More button */}
      <div className="product__btn">
        {visibleProducts < products.length && (
          <button className="btn" onClick={loadMoreProducts}>
            Xem thêm
          </button>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
