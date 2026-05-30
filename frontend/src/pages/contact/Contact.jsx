import React, { useState } from 'react';
import { useSubmitContactMutation } from '../../redux/features/contacts/contactsApi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitContact, { isLoading, isSuccess, isError, error }] = useSubmitContactMutation();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContact(formData).unwrap();
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert("Tin nhắn của bạn đã được gửi thành công!");
    } catch (err) {
      console.error("Failed to submit contact:", err);
      alert("Gửi tin nhắn thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="section__container rounded bg-primary-light">
        <h2 className="section__header">Liên hệ với chúng tôi</h2>
        <p className="section__subheader">
            Chúng tôi luôn ở đây để hỗ trợ bạn. Đừng ngần ngại liên hệ nếu bạn có bất kỳ câu hỏi nào.
        </p>
      </section>

      {/* Contact Content */}
      <section className="section__container mt-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Contact Details */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Thông tin liên hệ</h3>
              <p className="text-gray-600 mb-6 font-medium">
                Hãy ghé thăm cửa hàng hoặc liên hệ trực tiếp với chúng tôi qua các kênh sau:
              </p>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary text-white p-3 rounded-full">
                <i className="ri-map-pin-2-line text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Địa chỉ văn phòng</h4>
                <p className="text-gray-600">123 Đường Cầu Luân Đôn, Quận Hoàn Kiếm, Hà Nội</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary text-white p-3 rounded-full">
                <i className="ri-phone-line text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Điện thoại</h4>
                <p className="text-gray-600">(+84) 123 456 789</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary text-white p-3 rounded-full">
                <i className="ri-mail-line text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Email</h4>
                <p className="text-gray-600">support@lebabafashion.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary text-white p-3 rounded-full">
                <i className="ri-time-line text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Giờ làm việc</h4>
                <p className="text-gray-600">Thứ 2 - Thứ 7: 08:00 - 21:00</p>
                <p className="text-gray-600">Chủ nhật: 09:00 - 18:00</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Gửi tin nhắn</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input 
                  type="text" 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên của bạn"
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ email"
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                <input 
                  type="text" 
                  id="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Chủ đề bạn quan tâm"
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                <textarea 
                  id="message" 
                  rows="4" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung tin nhắn..."
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-primary-dark transition-colors shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Đang gửi...' : 'Gửi ngay'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
