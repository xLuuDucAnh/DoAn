import React from 'react';
import { Link } from 'react-router-dom';
import category1 from "../../assets/category-1.jpg"
import category2 from "../../assets/category-2.jpg"
import category3 from "../../assets/category-3.jpg"
import category4 from "../../assets/category-4.jpg"


const Categories = () => {
    const categories = [
        { name: 'Áo Nam', path: 'ao-nam-phong', image: category1 },
        { name: 'Áo Nữ', path: 'so-mi-nu', image: category2 },
        { name: 'Đầm Thời Trang', path: 'dam-dao-pho', image: category3},
        { name: 'Phụ Kiện', path: 'tui-xach', image: category4 },
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
