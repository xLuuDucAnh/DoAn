import React from 'react';
import Blogs from './Blogs';

const BlogPage = () => {
  return (
    <div>
      <section className="section__container rounded bg-primary-light">
        <h2 className="section__header">Trang tin tức</h2>
        <p className="section__subheader">
            Cập nhật những xu hướng thời trang mới nhất và các câu chuyện từ Lebaba.
        </p>
      </section>
      
      <section className="section__container">
        <Blogs />
      </section>
    </div>
  );
};

export default BlogPage;
