'use client'

import { useState } from 'react'
import { Trash2, ThumbsUp, ThumbsDown, Eye, EyeOff, Filter } from 'lucide-react'
import useSWR, { mutate } from 'swr'
import Fetch from '../middlewares/fetch'
import { formatCount } from '../middlewares/format'

export const Post = () => {
  const { data, isLoading } = useSWR('/posts', Fetch)
  const [filter, setFilter] = useState('all')

  const handleDelete = async id => {
    if (!window.confirm('Ҳа, сиз бу постни ўчиришни хохлайсизми?')) return
    try {
      await Fetch.delete(`/posts/${id}`)
      mutate('/posts')
    } catch (error) {
      alert(error.response?.data?.message || 'Постни ўчиришда хатолик')
    }
  }

  const handleShow = async id => {
    const postId = id
    try {
      await Fetch.post('/posts/show', { postId })
      mutate('/posts')
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Постнинг кўрсатилишини янгилашда хатолик'
      )
    }
  }

  const formatToUzbekDate = createdAt =>
    new Intl.DateTimeFormat('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
      .format(new Date(createdAt))
      .replace(',', '')

  const filteredPosts = data?.data?.filter(post => {
    if (filter === 'all') return true
    if (filter === 'visible') return post.show
    if (filter === 'hidden') return !post.show
    return true
  })

  return (
    <div className='w-full'>
      <div className='w-full flex-wrap gap-3 flex justify-between items-center mb-6'>
        <h1 className='text-2xl text-purple-700 font-bold'>
          Фойдаланувчи Постлари
        </h1>

        <div className='flex items-center gap-2 bg-white rounded-lg shadow-sm p-1'>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-purple-100 text-purple-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Барча
          </button>
          <button
            onClick={() => setFilter('visible')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === 'visible'
                ? 'bg-green-100 text-green-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Кўрсатилган
          </button>
          <button
            onClick={() => setFilter('hidden')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === 'hidden'
                ? 'bg-red-100 text-red-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Йўқотилган
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className='bg-white shadow-md rounded-xl p-5 animate-pulse'
            >
              <div className='flex items-start gap-2'>
                <div className='w-14 h-14 rounded-full bg-purple-200'></div>
                <div className='flex-1'>
                  <div className='h-5 bg-purple-200 rounded w-3/4 mb-2'></div>
                  <div className='h-4 bg-purple-100 rounded w-1/4'></div>
                </div>
              </div>
              <div className='h-20 bg-purple-100 rounded mt-3'></div>
              <div className='flex justify-between mt-4'>
                <div className='h-4 bg-purple-100 rounded w-1/4'></div>
                <div className='h-4 bg-purple-100 rounded w-1/4'></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts?.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filteredPosts.map(post => (
            <div
              key={post._id}
              className={`bg-white relative shadow-md hover:shadow-lg transition-shadow rounded-xl p-5 flex flex-col items-start text-start border-l-4 ${
                post.show ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className='absolute top-2 right-2 flex gap-1'>
                <button
                  onClick={() => handleShow(post._id)}
                  className={`${
                    post.show
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white rounded-full p-2 transition-colors`}
                  title={post.show ? 'Постни Йўқотиш' : 'Постни Кўрсатиш'}
                >
                  {post.show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className='bg-gray-200 text-gray-700 rounded-full p-2 hover:bg-red-500 hover:text-white transition-colors'
                  title='Постни Ўчириш'
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className='flex w-full items-start gap-2 justify-start mb-4 mt-6'>
                <img
                  src={post.avatar || '/placeholder.svg'}
                  alt='Avatar'
                  className='w-12 h-12 rounded-full object-cover border-2 border-purple-100'
                />
                <div className='flex flex-col'>
                  <h3 className='text-base font-semibold text-purple-800'>
                    {post.firstName || 'Номаълум'}
                  </h3>
                  <span className='text-xs text-gray-500'>
                    {formatToUzbekDate(post.createdAt)}
                  </span>
                </div>
              </div>

              <div className='bg-purple-50 p-3 rounded-lg w-full mb-3 max-h-[130px] overflow-x-auto'>
                <p className='text-gray-700 text-sm'>{post.sms}</p>
              </div>

              <div className='flex gap-4 text-gray-500 text-sm'>
                <div className='flex items-center gap-1'>
                  <ThumbsUp size={14} className='text-purple-600' />{' '}
                  {formatCount(post.likes)}
                </div>
                <div className='flex items-center gap-1'>
                  <ThumbsDown size={14} className='text-gray-400' />{' '}
                  {formatCount(post.dislikes)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
            <Filter size={24} className='text-purple-500' />
          </div>
          <p className='text-gray-600 text-lg font-medium'>Постлар топилмади</p>
          <p className='text-gray-500 text-sm mt-1'>
            {filter !== 'all'
              ? 'Фильтрни ўзгартириб кўришни синов қилиб кўринг'
              : 'Фойдаланувчилар ҳали постлар юбормаган'}
          </p>
        </div>
      )}
    </div>
  )
}
