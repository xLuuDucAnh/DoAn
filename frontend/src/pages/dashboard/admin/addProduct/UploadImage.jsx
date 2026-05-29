import React, { useState } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../../../../utils/baseURL';

const UploadImage = ({ name, setImage }) => {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const uploadSingleImage = (base64) => {
        setLoading(true);
        setError("");
        const baseUrl = getBaseUrl();
        
        axios
            .post(`${baseUrl}/uploadImage`, { image: base64 })
            .then((res) => {
                const imageUrl = res.data;
                setUrl(imageUrl);
                // console.log(imageUrl);
                alert("Tải ảnh lên thành công!");
                setImage(imageUrl); 
            })
            .then(() => setLoading(false))
            .catch((error) => {
                console.error("Lỗi tải ảnh:", error);
                const backendMsg = error.response?.data?.message;
                const errorMsg = backendMsg ? `Lỗi từ Server: ${backendMsg}` : "Không thể tải ảnh lên. Vui lòng kiểm tra lại kết nối server hoặc cấu hình Cloudinary.";
                setError(errorMsg);
                setLoading(false);
            });
    };

    const uploadImage = async (event) => {
        const files = event.target.files;

        if (files.length === 1) {
            const base64 = await convertBase64(files[0]);
            uploadSingleImage(base64);
            return;
        }

        const base64s = [];
        for (let i = 0; i < files.length; i++) {
            const base = await convertBase64(files[i]);
            base64s.push(base);
        }

        // Handle multiple image uploads if needed
    };

    return (
        <div className="space-y-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                Ảnh sản phẩm
            </label>
            <input
                onChange={uploadImage}
                name={name}
                id={name}
                type="file"
                className="add-product-InputCSS"
            />
            {loading && (
                <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <p>Đang tải ảnh lên...</p>
                </div>
            )}
            {url && !loading && (
                <div className="mt-2">
                    <p className="text-sm text-green-600 mb-2">✅ Đã tải ảnh lên thành công!</p>
                    <img src={url} alt="Uploaded" className="w-32 h-32 object-cover rounded shadow-md border border-gray-200" />
                </div>
            )}
            {error && (
                <div className="mt-2 text-sm text-red-600">
                    <p>❌ {error}</p>
                </div>
            )}
        </div>
    );
};

export default UploadImage;
