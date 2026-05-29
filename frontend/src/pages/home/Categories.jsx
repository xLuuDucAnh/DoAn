import React from 'react';
import { Link } from 'react-router-dom';
import category1 from "../../assets/category-1.jpg"
import category2 from "../../assets/category-2.jpg"
import category3 from "../../assets/category-3.jpg"
import category4 from "../../assets/category-4.jpg"


const Categories = () => {
    const categories = [
        { name: 'Áo Nam', path: 'ao-nam-phong', image: 'https://zeanus.vn/upload/product/zn-0127/ao-thun-nam-polo-trang-tre-trung-axh-171.jpg' },
        { name: 'Quần Jeans', path: 'quan-nam-jeans', image: 'https://heis.vn/storage/uploads/2019/10/11/5da0515addc08.jpg' },
        { name: 'Phụ Kiện Nam', path: 'tui-xach', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop' },
        { name: 'Giày Nam', path: 'giay-dep-nam', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop' },
    ];

    return (
        <>
        
        
        <div className="product__grid">
                {categories.map((category) => (
                    <Link
                        key={category.name}
                        to={`/categories/${category.path}`}
                        className="categories__card"
                    >
                        <img src={category.image} alt={category.name} />
                        <h4>{category.name}</h4>
                    </Link>
                ))}
            </div>
        </>
        
    );
};

export default Categories;
