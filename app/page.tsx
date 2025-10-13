import HeroCarousel from '@/components/HeroCarousel'
import HomePage from '@/components/Home'
import api from '@/lib/axios';
import React from 'react'

const page = async () => {
  const response = await api.get("/novels/featured");
  const featuredNovels = await response.data;
  

  return (
    <div className='min-h-screen  bg-background'>
      <div className='max-w-6xl mx-auto'>
        <HeroCarousel initialNovels={featuredNovels} />
        <HomePage />
      </div>
    </div>
  )
}

export default page
