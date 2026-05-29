import React from 'react'

import dealsImg from "../../assets/deals.png"

const DealsSection = () => {
  return (
    <section className="section__container deals__container">
    <div className="deals__image">
      <img src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=2070&auto=format&fit=crop" alt="deals" />
    </div>
    <div className="deals__content">
      <h5>Giảm giá lên đến 20%</h5>
      <h4>Ưu đãi của tháng này</h4>
      <p>
        Những ưu đãi thời trang nam của tháng đã sẵn sàng để biến giấc mơ phong cách của bạn thành hiện thực mà không tốn quá nhiều chi phí. Khám phá bộ sưu tập trang phục, phụ kiện và giày dép tinh tế, tất cả được tuyển chọn để nâng tầm tủ đồ của bạn.
      </p>
      <div className="deals__countdown flex-wrap">
        <div className="deals__countdown__card">
          <h4>14</h4>
          <p>Ngày</p>
        </div>
        <div className="deals__countdown__card">
          <h4>20</h4>
          <p>Giờ</p>
        </div>
        <div className="deals__countdown__card">
          <h4>15</h4>
          <p>Phút</p>
        </div>
        <div className="deals__countdown__card">
          <h4>05</h4>
          <p>Giây</p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default DealsSection