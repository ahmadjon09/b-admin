import React from 'react'
import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'
import '../assets/css/error.css'

export const Error = () => {
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-purple-600 to-purple-900 relative overflow-hidden'>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='stars-container absolute inset-0' />
      </div>

      <div className='absolute bottom-0 w-full'>
        <div className='mountain-silhouette' />
      </div>

      <div className='relative z-10 w-full max-w-md p-8 mx-4 rounded-2xl backdrop-blur-md bg-white/10 shadow-xl border border-white/20 animate-fadeIn text-center'>
        <div className='flex justify-center mb-6'>
          <div className='w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse-slow'>
            <AlertTriangle className='h-12 w-12 text-white' />
          </div>
        </div>

        <h1 className='text-8xl font-bold text-white mb-2 text-shadow'>404</h1>
        <h2 className='text-2xl font-medium text-white mb-6 text-shadow'>
          Саҳифа топилмади!
        </h2>

        <p className='text-white/80 mb-8'>
          Сиз қидираётган саҳифа мавжуд эмас ёки ўчирилган бўлиши мумкин.
        </p>

        <Link
          to={'/'}
          className='inline-flex items-center gap-2 bg-white hover:bg-white/90 text-purple-700 font-semibold py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-xl'
        >
          <Home className='h-5 w-5' />
          Бош саҳифага қайтиш
        </Link>
      </div>
    </div>
  )
}
