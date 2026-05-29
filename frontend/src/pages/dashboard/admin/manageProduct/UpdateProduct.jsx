import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import TextInput from '../addProduct/TextInput';
import UploadImage from '../addProduct/UploadImage';
import SelectInput from '../addProduct/SelectInput';
import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';

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
    { label: 'Trắng', value: 'white' },
    { label: 'Xám', value: 'gray' },
    { label: 'Xanh than', value: 'navy' },
    { label: 'Nâu', value: 'brown' },
    { label: 'Be', value: 'beige' },
    { label: 'Xanh rêu', value: 'olive' },
    { label: 'Đỏ đô', value: 'burgundy' }
];

const UpdateProduct = () => {
    const { id } = useParams();

    const navigate = useNavigate(); // For navigation
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        category: '',
        color: '',
        price: '',
        description: '',
        image: '', // This will store the URL or the image file
        stock: 0
    });
    const [newImage, setNewImage] = useState(null); // For storing the new image

    const { data: productData, isLoading: isProductLoading, error: fetchError, refetch } = useFetchProductByIdQuery(id); // Add refetch
    const { name, category, color, description, image: imageURL, price, stock } = productData?.product || {};

    const [updateProduct, { isLoading: isUpdating, error: updateError }] = useUpdateProductMutation();

    useEffect(() => {
        if (productData) {
            setProduct({
                name: name || '',
                category: category || '',
                color: color || '',
                price: price || '',
                description: description || '',
                image: imageURL || '',
                stock: stock || 0
            });
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const handleImageChange = (image) => {
        setNewImage(image); // Store new image
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If newImage is set, use it; otherwise, keep the old image URL
        const updatedProduct = {
            ...product,
            image: newImage ? newImage : product.image,
            author: user?._id
        };

        if (!updatedProduct.name) {
            alert('Vui lòng nhập tên sản phẩm.');
            return;
        }
        if (!updatedProduct.category) {
            alert('Vui lòng chọn danh mục sản phẩm.');
            return;
        }
        if (updatedProduct.price === '' || updatedProduct.price === null) {
            alert('Vui lòng nhập giá sản phẩm.');
            return;
        }
        if (!updatedProduct.image) {
            alert('Vui lòng đảm bảo đã có ảnh sản phẩm.');
            return;
        }

        try {
            await updateProduct({ id: id, ...updatedProduct }).unwrap();
            alert('Product updated successfully!');
            await refetch();
            navigate("/dashboard/manage-products");

        } catch (err) {
            console.error('Failed to update product:', err);
        }

    };

    if (isProductLoading) return <p>Loading product...</p>;
    if (fetchError) return <p className="text-red-500">Error fetching product: {fetchError.message}</p>;

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Update Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* product name */}
                <TextInput
                    label="Product Name"
                    name="name"
                    placeholder="Ex: Diamond Earrings"
                    value={product.name}
                    onChange={handleChange}
                />

                {/* category */}
                <SelectInput
                    label="Category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                />

                {/* color */}
                <SelectInput
                    label="Color"
                    name="color"
                    value={product.color}
                    onChange={handleChange}
                    options={colors}
                />

                {/* price */}
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

                {/* image upload */}
                <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-700">Ảnh sản phẩm</h3>
                    
                    {/* Option 1: URL */}
                    <TextInput
                        label="Cách 1: Nhập trực tiếp Link ảnh"
                        name="image"
                        type='text'
                        value={newImage || product.image}
                        onChange={(e) => {
                            // If user types a URL, treat it as newImage
                            setNewImage(e.target.value);
                        }}
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
                    <div>
                        {product.image && !newImage && (
                            <div className="mb-2">
                                <p className="text-xs text-gray-500 mb-1">Ảnh hiện tại:</p>
                                <img src={product.image} alt="Current" className="w-32 h-32 object-cover rounded shadow-sm border border-gray-200" />
                            </div>
                        )}
                        <UploadImage
                            name="image"
                            id="image"
                            setImage={setNewImage}
                        />
                    </div>
                </div>

                {/* description */}
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
                        className="add-product-InputCSS"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="add-product-btn"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Update Product'}
                    </button>
                </div>
            </form>

            {updateError && <p className="text-red-500 mt-4">Error updating product: {updateError.message}</p>}
        </div>
    );
};

export default UpdateProduct;
