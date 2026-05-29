import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useNavigate } from 'react-router-dom';

const categories = [
    { label: 'Chọn Danh Mục', value: '' },
    { label: 'Áo phông nam', value: 'ao-nam-phong' },
    { label: 'Polo nam', value: 'ao-nam-polo' },
    { label: 'Sơ mi dài nam', value: 'ao-nam-so-mi-dai' },
    { label: 'Sơ mi ngắn nam', value: 'ao-nam-so-mi-ngan' },
    { label: 'Quần âu nam', value: 'quan-nam-au' },
    { label: 'Quần jeans nam', value: 'quan-nam-jeans' },
    { label: 'Quần kaki nam', value: 'quan-nam-kaki' },
    { label: 'Quần jogger nam', value: 'quan-nam-jogger' },
    { label: 'Giày dép nam', value: 'giay-dep-nam' },
    { label: 'Mũ nam', value: 'mu-nam' },
    { label: 'Ví da nam', value: 'vi-da-nam' },
    { label: 'Thắt lưng nam', value: 'that-lung-nam' },
    { label: 'Vòng cổ', value: 'vong-co' },
    { label: 'Nước hoa', value: 'nuoc-hoa' }
];

const colors = [
    { label: 'Chọn màu sắc', value: '' },
    { label: 'Đen', value: 'black' },
    { label: 'Vàng', value: 'yellow' },
    { label: 'Trắng', value: 'white' },
    { label: 'Xám', value: 'gray' },
    { label: 'Xanh than', value: 'navy' },
    { label: 'Nâu', value: 'brown' },
    { label: 'Be', value: 'beige' },
    { label: 'Xanh rêu', value: 'olive' },
    { label: 'Đỏ đô', value: 'burgundy' }
];

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        category: '',
        color: '',
        price: '',
        description: '',
        stock: 0
    });
    const [image, setImage] = useState('');

    const [addProduct, { isLoading, error }] = useAddProductMutation();
    const navigate = useNavigate()


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product.name) {
            alert('Vui lòng nhập tên sản phẩm.');
            return;
        }
        if (!product.category) {
            alert('Vui lòng chọn danh mục sản phẩm.');
            return;
        }
        if (product.price === '' || product.price === null || undefined) {
            alert('Vui lòng nhập giá sản phẩm.');
            return;
        }
        if (!image) {
            alert('Vui lòng tải lên ảnh sản phẩm.');
            return;
        }
        try {
            await addProduct({ ...product, image, author: user?._id }).unwrap();
            alert('Product added successfully!');
            setProduct({ name: '', category: '', color: '', price: '', description: '', stock: 0 });
            setImage('');
            navigate("/shop")
        } catch (err) {
            console.error('Failed to add product:', err);
        }
    };

    // console.log("This is the image:", image)
    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="Product Name"
                    name="name"
                    placeholder="Ex: Diamond Earrings"
                    value={product.name}
                    onChange={handleChange}
                />
                <SelectInput
                    label="Category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                />
                <SelectInput
                    label="Color"
                    name="color"
                    value={product.color}
                    onChange={handleChange}
                    options={colors}
                />
                <TextInput
                    label="Price"
                    name="price"
                    type="number"
                    placeholder="50"
                    value={product.price}
                    onChange={handleChange}
                />
                <TextInput
                    label="Số lượng tồn kho"
                    name="stock"
                    type="number"
                    placeholder="100"
                    value={product.stock}
                    onChange={handleChange}
                />
                
                <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-700">Ảnh sản phẩm (Chọn 1 trong 2 cách)</h3>
                    
                    {/* Option 1: URL */}
                    <TextInput
                        label="Cách 1: Dán Link ảnh từ mạng"
                        name="image"
                        type='text'
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="VD: https://images.unsplash.com/photo..."
                    />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-gray-50 px-2 text-sm text-gray-500">HOẶC</span>
                        </div>
                    </div>

                    {/* Option 2: Upload */}
                    <UploadImage
                        name="image"
                        id="image"
                        setImage={setImage}
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        rows={6}
                        name="description"
                        id="description"
                        value={product.description}
                        placeholder='Write a product description'
                        onChange={handleChange}
                        className="add-product-InputCSS "
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="add-product-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Product'}
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 mt-4">Error adding product: {error.message}</p>}
        </div>
    );
};

export default AddProduct;
