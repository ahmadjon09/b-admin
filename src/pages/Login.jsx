import { User } from 'lucide-react'
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import '../assets/css/login.css'
import Fetch from '../middlewares/fetch'
import { LockKey } from '@phosphor-icons/react/dist/ssr'
import logo from '../assets/logo.png'

export const Login = () => {
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isPhoneValid, setIsPhoneValid] = useState(true)

  useEffect(() => {
    if (error) setError('')
  }, [phone, password])

  useEffect(() => {
    if (phone && (phone.length < 9 || phone.length > 12)) {
      setIsPhoneValid(false)
    } else {
      setIsPhoneValid(true)
    }
  }, [phone])

  const handleLogin = async e => {
    e.preventDefault()

    if (!isPhoneValid) {
      setError('Телефон рақами нотўғри')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { data } = await Fetch.post('admin/login', {
        password,
        phoneNumber: +phone
      })
      Cookies.set('admin_token', data.token, { secure: true, expires: 7 })
      window.location.href = '/'
    } catch (err) {
      const errorMessage =
        err.response?.data.message || 'Тизимга киришда хатолик юз берди'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-purple-600 to-purple-900 relative overflow-hidden'>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='stars-container absolute inset-0' />
      </div>

      <div className='absolute bottom-0 w-full'>
        <div className='mountain-silhouette' />
      </div>

      <div className='relative z-10 w-full max-w-md p-8 mx-4 rounded-2xl backdrop-blur-md bg-white/10 shadow-xl border border-white/20 animate-fadeIn'>
        <div className='flex w-full justify-center my-4'>
          <img
            className='w-[150px] animate-float'
            src={logo || '/placeholder.svg'}
            alt='Логотип'
          />
        </div>
        <h2 className='text-2xl font-medium text-white text-center mb-6'>
          Тизимга кириш
        </h2>

        <form onSubmit={handleLogin} className='space-y-6'>
          <div className='relative'>
            <input
              type='number'
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder='Телефон рақами'
              required
              className={`w-full px-12 py-3 bg-white/10 rounded-full border ${
                !isPhoneValid && phone ? 'border-red-400' : 'border-white/20'
              } text-white placeholder-white/70 focus:outline-none focus:border-white/40 transition-all`}
            />
            <User className='absolute left-4 top-3.5 h-5 w-5 text-white/70' />
            {!isPhoneValid && phone && (
              <p className='text-red-400 text-xs mt-1 ml-4'>
                Телефон рақами 9-12 рақамдан иборат бўлиши керак
              </p>
            )}
          </div>

          <div className='relative'>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='Пароль'
              required
              className='w-full px-12 py-3 bg-white/10 rounded-full border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white/40 transition-all'
            />
            <LockKey className='absolute left-4 top-3.5 h-5 w-5 text-white/70' />
          </div>

          {error && (
            <div className='text-red-400 w-full flex justify-center items-center bg-red-400/10 py-2 px-4 rounded-lg border border-red-400/20 animate-shake'>
              <span>{error}</span>
            </div>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className={`w-full py-3 rounded-full ${
              isLoading
                ? 'bg-white/35 cursor-not-allowed'
                : 'bg-white hover:bg-white/90'
            } text-purple-700 font-semibold transition-colors relative overflow-hidden`}
          >
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-purple-700'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Юкланмоқда...
              </div>
            ) : (
              'Кириш'
            )}
          </button>
        </form>
        <p className='text-white/50 text-xs text-center mt-6'>
          Тизимга киришда муаммо бўлса, администратор билан боғланинг:{' '}
          <a className='underline' href='https://t.me/ItsNoWonder'>
            Admin
          </a>
        </p>
      </div>
    </div>
  )
}
