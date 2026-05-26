import React from 'react'

const AdminStats = ({stats}) => {
  console.log(stats)
  return (
    <div className="my-5 space-y-4">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Tổng thu nhập</h2>
          <p className="text-2xl font-bold">{new Intl.NumberFormat('vi-VN').format(Math.round(stats.totalEarnings))} đ</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Tất cả đơn hàng</h2>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Tất cả người dùng</h2>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Tổng sản phẩm</h2>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminStats