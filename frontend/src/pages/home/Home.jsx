import React from 'react'
import { useSelector } from 'react-redux'
import Banner from './Banner'
import Categories from './Categories'
import HeroSection from './HeroSection'
import TrendingProducts from '../shop/TrendingProducts'
import DealsSection from './DealsSection'
import PromoBanner from './PromoBanner'
import Blogs from '../blogs/Blogs'
import RecommendedProducts from '../../components/RecommendedProducts'
import { useGetUserRecommendationsQuery } from '../../redux/features/products/productsApi'

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserRecommendationsQuery(user?.email, {
        skip: !user?.email,
    });

    const recommendations = data?.recommendations || [];

    return (
        <>
            <Banner />
            <Categories />
            <HeroSection />
            <TrendingProducts />
            {user && recommendations.length > 0 && (
                <RecommendedProducts 
                    products={recommendations} 
                    loading={isLoading} 
                    title="Gợi ý dành riêng cho bạn"
                />
            )}
            <DealsSection />
            <PromoBanner />
            <Blogs />
        </>
    )
}

export default Home