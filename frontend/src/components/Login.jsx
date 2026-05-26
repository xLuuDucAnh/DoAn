/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginUserMutation } from '../redux/features/auth/authApi';
import { setUser } from '../redux/features/auth/authSlice';


const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();

  const navigate = useNavigate();
  // console.log("Loging user Api", loginUser);
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    }

    try {
      const response = await loginUser(data).unwrap();
      // console.log(response)
      const { token, user } = response;
      dispatch(setUser({ user }));
      alert('Đăng nhập thành công');
      navigate('/');

    } catch (err) {
      setMessage("Vui lòng cung cấp email và mật khẩu hợp lệ!");
    }
  };



  return (
    <section className='h-screen flex items-center justify-center'>
      <div className='max-w-sm border shadow bg-white mx-auto p-8'>
        <h2 className='text-2xl font-semibold pt-5'>Vui lòng đăng nhập</h2>
        <form onSubmit={handleLogin} className='space-y-5 max-w-sm mx-auto pt-8'>
          <input type="text" value={email}
            className='w-full bg-gray-100 focus:outline-none px-5 py-3'
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Địa chỉ Email" required />

          <input type="password" value={password}
            className='w-full bg-gray-100 focus:outline-none px-5 py-3'
            onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" required />
          {
            message && <p className="text-red-500">{message}</p>  // Display error message if any
          }
          <button type="submit" disabled={loginLoading}
            className='w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md'
          >Đăng nhập</button>
        </form>

        <p className='my-5 italic text-sm text-center'>Chưa có tài khoản?
          <Link to="/register" className='text-red-700  px-1 underline'> Đăng ký </Link> tại đây.
        </p>
      </div>

    </section>

  );
};

export default Login;