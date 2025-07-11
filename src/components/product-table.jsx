import { Pencil, Trash2, Star } from 'lucide-react'
import { formatNumber, formatCount } from '../middlewares/format'

export const ProductTable = ({
  products,
  setSelectedProduct,
  openEditModal,
  handleDelete
}) => {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='h-full w-full pb-10 overflow-x-auto'>
        <table className='w-full text-sm sm:text-base'>
          <thead className='bg-purple-700 text-white'>
            <tr>
              <th className='py-3 px-2 sm:px-6 text-left'>Маҳсулот</th>
              <th className='py-3 px-2 sm:px-6 text-left'>ID</th>
              <th className='py-3 px-2 sm:px-6 text-left'>Категория</th>
              <th className='py-3 px-2 sm:px-4 text-center'>Амаллар</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {products.map(product => (
              <tr
                key={product._id}
                className='hover:bg-purple-50 transition-colors cursor-pointer'
                onClick={() => setSelectedProduct(product)}
              >
                <td className='py-3 px-2 sm:px-6'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0'>
                      <img
                        src={product.photos[0] || 'null'}
                        alt='Маҳсулот'
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-medium text-gray-800 truncate max-w-[150px]'>
                        {product.title || 'Номсиз маҳсулот'}
                      </span>
                      <div className='flex items-center text-xs text-gray-500'>
                        {product.rating > 0 && (
                          <div className='flex items-center mr-2'>
                            <Star className='h-3 w-3 text-yellow-500 fill-yellow-500 mr-0.5' />
                            <span>{product.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <span>
                          {new Date(product.createdAt).toLocaleDateString(
                            'uz-UZ'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className='py-3 px-2 sm:px-6 text-gray-600'>
                  {product.ID || '-'}
                </td>
                <td className='py-3 px-2 sm:px-6 text-gray-600'>
                  {product.category || '-'}
                </td>

                <td className='py-3 px-2 sm:px-4 text-center'>
                  <div className='flex justify-center items-center gap-2'>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        openEditModal(product._id)
                      }}
                      className='bg-sky-600 text-white rounded-md p-1.5 hover:bg-sky-700 transition-colors'
                    >
                      <Pencil className='text-white w-4 h-4' />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleDelete(product._id)
                      }}
                      className='bg-red-500 text-white rounded-md p-1.5 hover:bg-red-600 transition-colors'
                    >
                      <Trash2 className='text-white w-4 h-4' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
