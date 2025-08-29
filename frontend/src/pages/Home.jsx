import React from 'react'
import Hero from '../components/Hero'
import Featuredsection from '../components/Featuredsection'
import Banner from '../components/Banner'
import Testimonails from '../components/Testimonails'


const Home = () => {
  return (
    <>
        <Hero />
        <Featuredsection />
        <Banner />
        <br/>
        <br />
        <Testimonails />
        <br/>
    </>
  )
}

export default Home