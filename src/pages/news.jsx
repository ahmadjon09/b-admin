import { Trash2 } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Fetch from '../middlewares/fetch'
import { useRef, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { IsOpenModal } from '../assets/css/Modal'
import { Post } from '../pages/post'
import { AddNews } from '../modules/addNews'

export const News = () => {
  const { data, isLoading } = useSWR('/news', Fetch)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenC, setIsOpenC] = useState(false)
  const [activeTab, setActiveTab] = useState('news')
  const data_ = data?.data?.data

  const handleDelete = async id => {
    if (!window.confirm('Сиз ушбу янгиликни ўчиришни хохлайсизми?')) return
    try {
      await Fetch.delete(`news/${id}`)
      mutate('/news')
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Каруселларини ўчиришда хатолик юз берди'
      )
    }
  }

  return (
    <div className='w-full pb-[100px] container'>
      <div className='flex justify-between flex-wrap gap-3 min-h-[100px] p-5 items-center border-b border-purple-300 bg-white shadow-sm'>
        <div className='flex gap-2 flex-wrap'>
          <button
            onClick={() => {
              setIsOpenC(true)
              IsOpenModal(true)
            }}
            className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-md shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all'
          >
            + Янгилик
          </button>
        </div>
      </div>

      <div className='flex border-b border-purple-200 bg-white'>
        <button
          onClick={() => setActiveTab('news')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === 'news'
              ? 'border-b-2 border-purple-600 text-purple-700'
              : 'text-gray-500 hover:text-purple-600'
          }`}
        >
          Карусел
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === 'posts'
              ? 'border-b-2 border-purple-600 text-purple-700'
              : 'text-gray-500 hover:text-purple-600'
          }`}
        >
          Постлар
        </button>
      </div>

      <div className='p-4'>
        {activeTab === 'news' ? (
          <>
            <Swiper
              spaceBetween={15}
              centeredSlides={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false
              }}
              pagination={{ clickable: true }}
              modules={[Autoplay, Pagination, Navigation]}
              className='mySwiper h-[300px] sm:h-[400px] md:h-[500px] px-2 rounded-xl overflow-hidden'
            >
              {isLoading ? (
                <SwiperSlide className='flex items-center justify-center text-lg font-bold text-gray-600 bg-purple-50'>
                  <div className='flex flex-col items-center'>
                    <div className='w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mb-4'></div>
                    <p>Карусел юкланмоқда...</p>
                  </div>
                </SwiperSlide>
              ) : data_?.length > 0 ? (
                data_.map(item => (
                  <SwiperSlide
                    key={item._id}
                    className='relative h-full active:cursor-grab rounded-xl overflow-hidden'
                  >
                    <img
                      src={item.photos[0] || '/placeholder.svg'}
                      className='w-full h-full object-cover'
                      alt={item.title}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end items-start text-white text-left px-4 sm:px-6 md:px-8 py-6 sm:py-8'>
                      <span className='text-xs sm:text-sm md:text-lg font-bold tracking-widest mb-1 sm:mb-2 bg-purple-600 px-2 py-1 rounded-md'>
                        {item.title}
                      </span>
                      <h1 className='text-sm sm:text-lg md:text-2xl font-bold tracking-widest sm:w-[20rem] md:w-[25rem]'>
                        {item.description}
                      </h1>
                    </div>
                    <div className='absolute z-10 bottom-10 right-10 sm:right-14'>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className='bg-red-500 text-white rounded-full p-3 sm:p-4 hover:bg-red-600 transition-all shadow-lg'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide className='flex items-center justify-center text-lg font-bold text-gray-600 bg-purple-50'>
                  <div className='flex flex-col items-center'>
                    <p className='text-2xl mb-2'>🖼️</p>
                    <p>Карусел элементлари топилмади</p>
                    <button
                      onClick={() => {
                        setIsOpenC(true)
                        IsOpenModal(true)
                      }}
                      className='mt-4 px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors'
                    >
                      Биринчи Каруселингизни Қўшинг
                    </button>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </>
        ) : (
          <Post />
        )}
      </div>

      {isOpen && (
        <UserUpdate id={user?._id} isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
      {isOpenC && <AddNews setIsOpen={setIsOpenC} isOpen={isOpenC} />}
    </div>
  )
}
