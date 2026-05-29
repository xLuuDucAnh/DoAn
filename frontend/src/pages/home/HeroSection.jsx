import React from 'react';
import card1 from '../../assets/card-1.png';
import card2 from '../../assets/card-2.png';
import card3 from '../../assets/card-3.png';

// Data for cards
const cards = [
  {
    id: 1,
    image: 'https://namfashion.com/home/wp-content/uploads/2021/04/ao-phong-nam-coc-tay-co-tim-han-quoc-cao-cap-dep-ha-noi-7.jpg',
    trend: 'Xu hướng 2024',
    title: 'Áo sơ mi nam',
    link: '#',
  },
  {
    id: 2,
    image: 'https://badass.vn/wp-content/uploads/2026/02/Screenshot_18-1-e1773117920174.png',
    trend: 'Xu hướng 2024',
    title: 'Áo khoác Nam',
    link: '#',
  },
  {
    id: 3,
    image: 'https://images2.thanhnien.vn/zoom/686_429/528068263637045248/2024/2/25/3-17088702939852004248209-986-0-1840-1366-crop-17088756164801242915330.jpeg',
    trend: 'Xu hướng 2024',
    title: 'Đồ mặc hàng ngày',
    link: '#',
  },
];

const HeroSection = () => {
  return (
    <section className="section__container hero__container">
      {cards.map((card) => (
        <div key={card.id} className="hero__card">
          <img src={card.image} alt={card.title} />
          <div className="hero__content">
            <p>{card.trend}</p>
            <h4>{card.title}</h4>
            <a href={card.link}>Khám phá thêm +</a>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HeroSection;
