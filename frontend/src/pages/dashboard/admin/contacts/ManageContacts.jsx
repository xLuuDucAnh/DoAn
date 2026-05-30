import React from 'react';
import { useFetchAllContactsQuery, useDeleteContactMutation } from '../../../../redux/features/contacts/contactsApi';
import { formatDate } from '../../../../utils/dateFormater';

const ManageContacts = () => {
    const { data: contacts, isLoading, error, refetch } = useFetchAllContactsQuery();
    const [deleteContact] = useDeleteContactMutation();

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tin nhắn này?")) {
            try {
                await deleteContact(id).unwrap();
                alert("Xóa tin nhắn thành công!");
                refetch();
            } catch (err) {
                console.error("Failed to delete contact:", err);
                alert("Xóa thất bại, vui lòng thử lại.");
            }
        }
    };

    if (isLoading) return <div className="p-6">Đang tải danh sách liên hệ...</div>;
    if (error) return <div className="p-6 text-red-500">Lỗi khi tải dữ liệu.</div>;

    return (
        <section className="section__container mt-10">
            <div className="flex flex-col mb-6">
                <h2 className="text-2xl font-semibold mb-2">Quản lý liên hệ</h2>
                <p className="text-gray-500">Xem và quản lý các tin nhắn từ khách hàng.</p>
            </div>

            <div className="w-full mb-12 xl:mb-0 px-4 mx-auto">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    <div className="block w-full overflow-x-auto">
                        <table className="items-center bg-transparent w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">STT</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Họ tên</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Email</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Chủ đề</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Nội dung</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Ngày gửi</th>
                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts && contacts.map((contact, index) => (
                                    <tr key={contact._id}>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{index + 1}</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 font-semibold">{contact.name}</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{contact.email}</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{contact.subject}</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4 max-w-xs overflow-hidden text-ellipsis">{contact.message}</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-blue-500">{formatDate(contact.createdAt)}</td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                            <button 
                                                onClick={() => handleDelete(contact._id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ManageContacts;
