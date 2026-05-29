import React from 'react';
import bannerImg from "../../assets/header.png"
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <header className="section__container header__container">
      <div className="header__content z-30">
        <h4>GIẢM GIÁ LÊN ĐẾN 20% CHO</h4>
        <h1>Thời trang Nam giới</h1>
        <p>
          Khám phá những xu hướng mới nhất và thể hiện phong cách riêng biệt của bạn với bộ sưu tập thời trang nam của chúng tôi. Tìm kiếm những bộ trang phục, phụ kiện và giày dép được tuyển chọn kỹ lưỡng, phù hợp với mọi sở thích và dịp lễ.
        </p>
        <button className="btn"><Link to="/shop">KHÁM PHÁ NGAY</Link></button>
      </div>
      <div className="header__image">
        <img src="https://www.pngall.com/wp-content/uploads/5/Attractive-Model-Man-PNG.png" alt="header" />
      </div>
    </header>
  );
};

export default Banner;
