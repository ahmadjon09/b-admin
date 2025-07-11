import { X, Pencil, Trash2, Star, Package, Calendar } from 'lucide-react'
import { formatNumber, formatCount } from '../middlewares/format'

export const ProductDetailModal = ({ product, onClose, onEdit, onDelete }) => {
  if (!product) return null

  // Calculate total stock from all variants
  const getTotalStock = () => {
    if (!product.variants || product.variants.length === 0) return 0
    return product.variants.reduce(
      (total, variant) => total + (variant.stock || 0),
      0
    )
  }

  // Get price range from variants
  const getPriceRange = () => {
    if (!product.variants || product.variants.length === 0)
      return 'Нарх кўрсатилмаган'

    const prices = product.variants
      .map(variant => variant.price)
      .filter(price => price > 0)
    if (prices.length === 0) return 'Нарх кўрсатилмаган'

    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    if (minPrice === maxPrice) {
      return formatNumber(minPrice)
    }
    return `${formatNumber(minPrice)} - ${formatNumber(maxPrice)}`
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[1000]'>
      <div className='bg-white p-4 md:p-6 rounded-lg shadow-xl max-w-2xl w-full overflow-y-auto max-h-[90vh]'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-bold text-gray-800'>
            Маҳсулот тафсилотлари
          </h2>
          <button
            onClick={onClose}
            className='text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Product Image */}
        <div className='relative mb-6 z-[999] overflow-hidden rounded-lg shadow-md'>
          {product.photos && product.photos.length > 0 ? (
            <div className='aspect-ratio-container relative'>
              <img
                src={product.photos[0] || '/placeholder.svg'}
                alt='Маҳсулот'
                className='w-full h-auto object-contain bg-gray-50 rounded-lg transition-transform duration-300 hover:scale-105 max-h-[250px] md:max-h-[300px]'
              />
              {product.photos.length > 1 && (
                <div className='absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full'>
                  +{product.photos.length - 1} фото
                </div>
              )}
            </div>
          ) : (
            <div className='w-full h-48 md:h-64 bg-gray-200 rounded-lg flex items-center justify-center'>
              <p className='text-gray-500 text-sm md:text-base'>
                Расм мавжуд эмас
              </p>
            </div>
          )}
        </div>

        {/* Basic Product Info */}
        <div className='bg-gray-50 p-4 rounded-lg mb-4'>
          <div className='mb-4'>
            <h3 className='font-bold text-xl text-gray-800 mb-2'>
              {product.title || 'Кўрсатилмаган'}
            </h3>
            {product.rating > 0 && (
              <div className='flex items-center mb-2'>
                <Star className='h-4 w-4 text-yellow-500 fill-yellow-500 mr-1' />
                <span className='font-medium'>{product.rating.toFixed(1)}</span>
              </div>
            )}
            <p className='text-gray-600 text-sm mb-3'>{product.description}</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <p className='flex flex-col'>
              <span className='text-gray-500 text-sm'>ID:</span>
              <span className='font-medium'>
                {product.ID || 'Кўрсатилмаган'}
              </span>
            </p>
            <p className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Категория:</span>
              <span className='font-medium'>
                {product.category || 'Кўрсатилмаган'}
              </span>
            </p>
            <p className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Бренд:</span>
              <span className='font-medium'>
                {product.brand || 'Кўрсатилмаган'}
              </span>
            </p>
            <p className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Нарх:</span>
              <span className='font-medium text-green-600'>
                {getPriceRange()}
              </span>
            </p>
            {product.sale > 0 && (
              <p className='flex flex-col'>
                <span className='text-gray-500 text-sm'>Чегирма:</span>
                <span className='font-medium text-red-600'>
                  {product.sale}%
                </span>
              </p>
            )}
            <p className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Умумий захира:</span>
              <span className='font-medium'>
                {formatCount(getTotalStock())}
              </span>
            </p>
            <p className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Сотилган миқдор:</span>
              <span className='font-medium'>
                {formatCount(product.selled_count) || 0}
              </span>
            </p>
            {product.expiryDate && (
              <p className='flex flex-col'>
                <span className='text-gray-500 text-sm'>
                  Яроқлилик муддати:
                </span>
                <span className='font-medium text-orange-600'>
                  {new Date(product.expiryDate).toLocaleDateString('uz-UZ')}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className='bg-blue-50 p-4 rounded-lg mb-4'>
            <h4 className='font-semibold text-gray-800 mb-3 flex items-center'>
              <Package className='w-4 h-4 mr-2' />
              Вариантлар ({product.variants.length})
            </h4>
            <div className='space-y-2'>
              {product.variants.map((variant, index) => (
                <div
                  key={index}
                  className='bg-white p-3 rounded-lg border border-blue-200'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      {variant.color && variant.color.name && (
                        <div className='flex items-center gap-2'>
                          <div
                            className='w-4 h-4 rounded-full border border-gray-300'
                            style={{ backgroundColor: variant.color.value }}
                          />
                          <span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                            {variant.color.name}
                          </span>
                        </div>
                      )}
                      {variant.weight && (
                        <span className='text-sm bg-green-100 text-green-800 px-2 py-1 rounded'>
                          {variant.weight}
                        </span>
                      )}
                    </div>
                    <div className='text-right'>
                      <div className='font-medium text-green-600'>
                        {formatNumber(variant.price)}
                      </div>
                      <div className='text-sm text-gray-600'>
                        Захира: {variant.stock || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className='bg-orange-50 p-4 rounded-lg mb-4'>
            <h4 className='font-semibold text-gray-800 mb-3'>Таркиб</h4>
            <div className='flex flex-wrap gap-2'>
              {product.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className='bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm border border-orange-200'
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Flavors */}
        {product.flavors && product.flavors.length > 0 && (
          <div className='bg-purple-50 p-4 rounded-lg mb-4'>
            <h4 className='font-semibold text-gray-800 mb-3'>
              Флаворлар ({product.flavors.length})
            </h4>
            <div className='space-y-3'>
              {product.flavors.map((flavor, index) => (
                <div
                  key={index}
                  className='bg-white p-3 rounded-lg border border-purple-200'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <h5 className='font-medium text-purple-800'>
                      {flavor.name}
                    </h5>
                    <div className='text-right'>
                      <div className='font-medium text-green-600'>
                        {formatNumber(flavor.price)}
                      </div>
                      <div className='text-sm text-gray-600'>
                        Захира: {flavor.stock || 0}
                      </div>
                    </div>
                  </div>
                  {flavor.ingredients && flavor.ingredients.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {flavor.ingredients.map((ingredient, idx) => (
                        <span
                          key={idx}
                          className='bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs'
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creation Date */}
        <div className='bg-gray-50 p-3 rounded-lg mb-4'>
          <p className='flex items-center text-sm text-gray-600'>
            <Calendar className='w-4 h-4 mr-2' />
            <span className='mr-2'>Қўшилган сана:</span>
            <span className='font-medium'>
              {new Date(product.createdAt).toLocaleDateString('uz-UZ')}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end items-center gap-3 flex-wrap'>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
          >
            Ёпиш
          </button>
          <button
            onClick={() => {
              onClose()
              onEdit(product._id)
            }}
            className='bg-sky-600 text-white rounded-md px-4 py-2 hover:bg-sky-700 flex items-center transition-colors'
          >
            <Pencil className='text-white w-4 h-4 mr-2' />
            Таҳрирлаш
          </button>
          <button
            onClick={() => {
              onClose()
              onDelete(product._id)
            }}
            className='bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-700 flex items-center transition-colors'
          >
            <Trash2 className='text-white w-4 h-4 mr-2' />
            Ўчириш
          </button>
        </div>
      </div>
    </div>
  )
}
