import React from 'react'
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice';
import { Link, NavLink } from 'react-router-dom';

const AdminDashboard = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch()
  const handleLogout = async (s) => {
    try {
      await logoutUser().unwrap();
      dispatch(logout())

    } catch (err) {
      console.error("Failed to logout:", err);
    }
  }
  return (
    <div className="space-y-5 bg-white p-8 md:h-screen flex flex-col justify-between">
      <div>
        <div className="nav__logo">
          <Link to="/" >Lebaba<span>.</span></Link>
          <p className='text-xs italic'>Bảng quản trị</p>
        </div>
        <hr className='mt-5' />
        <ul className="space-y-5 pt-5">
          <li>
            <NavLink
              to="/dashboard/admin"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Bảng điều khiển
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/add-new-post"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Thêm bài viết mới
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-products"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Quản lý sản phẩm
            </NavLink>
          </li>

          <li className="mb-3">
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Người dùng
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink
              to="/dashboard/manage-orders"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Quản lý đơn hàng
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink
              to="/dashboard/manage-contacts"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-black"
              }
            >
              Quản lý liên hệ
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="mb-3">
        <hr className="mb-3" />
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 font-medium px-5 py-1 rounded-sm">
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard