'use client'

import { useState } from 'react'
import { X, Upload, AlertCircle } from 'lucide-react'
import Fetch from '../middlewares/fetch'
import { IsOpenModal } from '../assets/css/Modal'
import { mutate } from 'swr'
import { motion, AnimatePresence } from 'framer-motion'

export const AddNews = ({ isOpen, setIsOpen }) => {
  const [error, setError] = useState('')
  const [carouselData, setCarouselData] = useState({
    title: '',
    description: '',
    photos: []
  })
  const [imagePending, setImagePending] = useState(false)
  const [previewUrls, setPreviewUrls] = useState([])

  const handleFormSubmit = async e => {
    e.preventDefault()

    if (carouselData.photos.length === 0) {
      setError('Илтимос, камида битта расм юкланг')
      return
    }

    try {
      await Fetch.post('/news/create', carouselData)
      setIsOpen(false)
      IsOpenModal(false)
      mutate('/news')
    } catch (error) {
      setError(error.response?.data?.message || 'Хатолик юз берди')
    }
  }

  const handleFileChange = async e => {
    try {
      const files = e.target.files
      if (!files || files.length === 0) return

      const newPreviewUrls = []
      for (let i = 0; i < files.length; i++) {
        newPreviewUrls.push(URL.createObjectURL(files[i]))
      }
      setPreviewUrls(newPreviewUrls)

      setImagePending(true)
      setError('')

      const uploadedImages = []

      // Fayllarni alohida-alohida imgbb'ga yuborish (har biriga alohida so‘rov)
      for (let i = 0; i < files.length; i++) {
        const formImageData = new FormData()
        formImageData.append('image', files[i]) // 👈 imgbb uchun 'image'

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=955f1e37f0aa643262e734c080305b10`,
          {
            method: 'POST',
            body: formImageData
          }
        )

        const result = await res.json()

        if (result.success) {
          uploadedImages.push(result.data.url)
        } else {
          throw new Error('Rasmlardan biri yuklanmadi.')
        }
      }

      // Rasmlar muvaffaqiyatli yuklangach, carousel uchun saqlash
      setCarouselData(prevData => ({
        ...prevData,
        photos: uploadedImages
      }))
    } catch (error) {
      setError('Расмларни юклашда хатолик. Илтимос, қайта уриниб кўринг.')
      console.log(error)
    } finally {
      setImagePending(false)
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setCarouselData(prevData => ({ ...prevData, [name]: value }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center'
          onClick={() => {
            setIsOpen(false)
            IsOpenModal(false)
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className='w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden'
            onClick={e => e.stopPropagation()}
          >
            <div className='bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center'>
              <h1 className='text-xl font-bold text-white'>
                Янги янгилик қўшиш
              </h1>
              <button
                onClick={() => {
                  setIsOpen(false)
                  IsOpenModal(false)
                }}
                className='text-white hover:bg-white/20 rounded-full p-1 transition-colors'
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className='p-6'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <label
                    htmlFor='title'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Сарлавҳа
                  </label>
                  <input
                    id='title'
                    type='text'
                    name='title'
                    placeholder='Янгилик сарлавҳасини киритинг'
                    onChange={handleInputChange}
                    required
                    className='w-full border border-purple-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all'
                  />
                </div>

                <div className='space-y-2'>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Тавсиф
                  </label>
                  <textarea
                    id='description'
                    name='description'
                    placeholder='Янгилик тавсифини киритинг'
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className='w-full border border-purple-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Расм
                  </label>

                  <div
                    className={`relative border-2 border-dashed rounded-lg p-4 transition-colors w-full h-full ${
                      imagePending
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    <div className='flex flex-col items-center justify-center py-3'>
                      {imagePending ? (
                        <div className='flex flex-col items-center'>
                          <div className='w-10 h-10 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mb-2'></div>
                          <p className='text-sm text-purple-600'>
                            Расмлар юкланмоқда...
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className='w-10 h-10 text-purple-500 mb-2' />
                          <p className='text-sm text-gray-600 mb-1'>
                            Расмларни ташланг ёки танланг
                          </p>
                          <p className='text-xs text-gray-500'>
                            PNG, JPG, GIF 10MB гача
                          </p>
                        </>
                      )}
                    </div>

                    {/* 👇 input faqat rasm zonasida ishlaydi */}
                    <input
                      type='file'
                      name='photos'
                      onChange={handleFileChange}
                      multiple
                      accept='image/*'
                      disabled={imagePending}
                      className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                    />
                  </div>

                  {previewUrls.length > 0 && (
                    <div className='mt-4 grid grid-cols-3 gap-2'>
                      {previewUrls.map((url, index) => (
                        <div
                          key={index}
                          className='relative rounded-lg overflow-hidden h-20'
                        >
                          <img
                            src={url || '/placeholder.svg'}
                            alt={`Превью ${index}`}
                            className='w-full h-full object-cover'
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className='bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2'>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className='flex gap-3 pt-4'>
                  <button
                    type='button'
                    onClick={() => {
                      setIsOpen(false)
                      IsOpenModal(false)
                    }}
                    className='flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors'
                  >
                    Бекор қилиш
                  </button>
                  <button
                    type='submit'
                    disabled={imagePending}
                    className={`flex-1 py-2.5 rounded-lg text-white font-medium transition-colors ${
                      imagePending
                        ? 'bg-purple-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                    }`}
                  >
                    {imagePending ? 'Юкланмоқда...' : 'Сақлаш'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
