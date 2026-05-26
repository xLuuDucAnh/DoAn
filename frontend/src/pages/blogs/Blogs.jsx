import React from 'react';
import blogsData from '../../data/blogs.json'; 

const Blogs = () => {
  // console.log(blogsData)
  return (
    <section className="section__container blog__container">
      <h2 className="section__header">Bài viết mới nhất</h2>
      <p className="section__subheader">
        Khám phá những tin tức và mẹo thời trang từ blog của chúng tôi.
      </p>
      <div className="md:p-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {blogsData.map(blog => (
          <div className="blog__card cursor-pointer hover:scale-105 transition-all duration-200" key={blog.id}>
            <img src={blog.imageUrl} alt={blog.title} />
            <div className="blog__card__content">
              <h6>{blog.subtitle}</h6>
              <h4>{blog.title}</h4>
              <p>{blog.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blogs;
