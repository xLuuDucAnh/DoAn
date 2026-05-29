import React, { useState } from 'react';
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const categoryGroups = [
    {
        name: 'Áo nam',
        subcategories: [
            { label: 'Áo phông', value: 'ao-nam-phong' },
            { label: 'Polo', value: 'ao-nam-polo' },
            { label: 'Sơ mi dài', value: 'ao-nam-so-mi-dai' },
            { label: 'Sơ mi ngắn', value: 'ao-nam-so-mi-ngan' }
        ]
    },
    {
        name: 'Quần nam',
        subcategories: [
            { label: 'Quần âu', value: 'quan-nam-au' },
            { label: 'Quần jeans', value: 'quan-nam-jeans' },
            { label: 'Quần kaki', value: 'quan-nam-kaki' },
            { label: 'Quần jogger', value: 'quan-nam-jogger' }
        ]
    },
    {
        name: 'Phụ kiện nam',
        subcategories: [
            { label: 'Giày, dép', value: 'giay-dep-nam' },
            { label: 'Mũ', value: 'mu-nam' },
            { label: 'Ví da', value: 'vi-da-nam' },
            { label: 'Thắt lưng', value: 'that-lung-nam' }
        ]
    }
];

const filters = {
    categories: ['all', ...categoryGroups.flatMap(group => group.subcategories.map(sub => sub.value))],
    colors: ['all', 'black', 'white', 'gray', 'navy', 'brown', 'beige', 'olive', 'burgundy'],
    priceRanges: [
        { label: 'Dưới 1.000.000 đ', min: 0, max: 1000000 },
        { label: '1.000.000 đ - 2.000.000 đ', min: 1000000, max: 2000000 },
        { label: '2.000.000 đ - 5.000.000 đ', min: 2000000, max: 5000000 },
        { label: 'Trên 5.000.000 đ', min: 5000000, max: Infinity }
    ]
};

const ShopPage = () => {
    const [filtersState, setFiltersState] = useState({
        category: 'all',
        color: 'all',
        priceRange: ''
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);

    const { category, color, priceRange } = filtersState;
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);

    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: category !== 'all' ? category : '',
        color: color !== 'all' ? color : '',
        minPrice: isNaN(minPrice) ? '' : minPrice,
        maxPrice: isNaN(maxPrice) ? '' : maxPrice,
        page: currentPage,
        limit: productsPerPage
    });


    const handlePageChange = (pageNumber) => {
        console.log(`Changing to page: ${pageNumber}`);
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const clearFilters = () => {
        setFiltersState({
            category: 'all',
            color: 'all',
            priceRange: ''
        });
    };

    if (isLoading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi khi tải sản phẩm.</p>;

    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = startProduct + products.length - 1;

    return (
        <>
            <section className="section__container rounded bg-primary-light">
                <h2 className="section__header">Trang Cửa Hàng</h2>
                <p className="section__subheader">
                    Khám phá những phong cách thời thượng: Nâng tầm diện mạo của bạn với bộ sưu tập thời trang nam cao cấp của chúng tôi.
                </p>
            </section>
            <section className='section__container'>
                <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
                    {/* left side */}
                    <ShopFiltering
                        filters={filters}
                        categoryGroups={categoryGroups}
                        filtersState={filtersState}
                        setFiltersState={setFiltersState}
                        clearFilters={clearFilters}
                    />

                    {/* right side */}
                    <div>
                        <h3 className='text-xl font-medium mb-4'>Hiển thị {startProduct} đến {endProduct} trong tổng số {totalProducts} sản phẩm</h3>
                        <ProductCards products={products} />
                        
                        {/* Pagination controls */}
                        <div className="mt-6 flex justify-center">
                             <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                            >
                                Trước
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md mx-1`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-2"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ShopPage;
