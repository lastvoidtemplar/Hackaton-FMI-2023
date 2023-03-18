import React from 'react'
import Header from './Header'

const Landing = () => {
  return (
    <>
      <Header />
      <main className='bg-secondary pt-4 h-100'>
        <h1 className='text-center'>Sample  name</h1>
        <h2 className='text-center'>by koch kompania</h2>
        <button className='text-center '>Get Started</button>
      </main>
    </>
  )
}

export default Landing