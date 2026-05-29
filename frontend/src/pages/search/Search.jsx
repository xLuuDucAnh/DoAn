import React, { useState } from 'react';
import { useSearchProductsQuery } from '../../redux/features/products/productsApi';
import ProductCards from '../shop/ProductCards';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isLoading } = useSearchProductsQuery(searchTerm, {
        skip: !searchTerm,
    });

    const products = data?.products || [];

    const handleSearch = () => {
        setSearchTerm(searchQuery.trim());
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <>
            <section className="section__container bg-primary-light">
                <h2 className="section__header">Tìm kiếm sản phẩm</h2>
                <p className="section__subheader">
                    Khám phá đa dạng các danh mục, từ những bộ váy sang trọng đến các phụ kiện linh hoạt. Nâng tầm phong cách của bạn ngay hôm nay!
                </p>
            </section>
            <section className="section__container">
                <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="search-bar w-full max-w-4xl p-2 border rounded"
                    />
                    <button
                        onClick={handleSearch}
                        className="search-button w-full md:w-auto py-2 px-8 bg-primary text-white rounded"
                    >
                        Tìm kiếm
                    </button>
                </div>

                {isLoading && <p className="text-center">Đang tìm kiếm...</p>}

                {!isLoading && searchTerm && products.length === 0 && (
                    <p className="text-center text-gray-500">
                        Không tìm thấy sản phẩm nào cho "{searchTerm}"
                    </p>
                )}

                {products.length > 0 && <ProductCards products={products} />}
            </section>
        </>
    );
};

export default Search;
