import React from 'react'

const PromoBanner = () => {
  return (
    <section className="section__container banner__container">
      <div className="banner__card">
        <span><i className="ri-truck-line"></i></span>
        <h4>Miễn phí vận chuyển</h4>
        <p>
          Mang lại sự tiện lợi và khả năng mua sắm từ mọi nơi, mọi lúc.
        </p>
      </div>
      <div className="banner__card">
        <span><i className="ri-money-dollar-circle-line"></i></span>
        <h4>Hoàn tiền 100%</h4>
        <p>
          Thương mại điện tử có hệ thống đánh giá để khách hàng có thể chia sẻ phản hồi.
        </p>
      </div>
      <div className="banner__card">
        <span><i className="ri-user-voice-fill"></i></span>
        <h4>Hỗ trợ nhiệt tình</h4>
        <p>
          Cung cấp các dịch vụ hỗ trợ khách hàng để giải đáp các thắc mắc và vấn đề của họ.
        </p>
      </div>
    </section>
  )
}

export default PromoBanner