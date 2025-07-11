import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import useSWR, { mutate } from 'swr'
import Fetch from '../middlewares/fetch'
import '../assets/css/home.css'
import { ProductModal } from '../modules/ProductModal'
import { SearchBar } from '../components/search-bar'
import { ProductTable } from '../components/product-table'
import { ProductDetailModal } from '../components/product-detail-modal'
import { EmptyState } from '../components/empty-state'
import { LoadingState } from '../components/loading-state'
import { ErrorState } from '../components/error-state'

export const Home = () => {
  const { data, isLoading, error } = useSWR('/product', Fetch)
  const products = data?.data.data || []
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBy, setSearchBy] = useState('title')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editProductId, setEditProductId] = useState(null)

  useEffect(() => {
    if (!products.length) {
      if (filteredProducts.length !== 0) {
        setFilteredProducts([])
      }
      return
    }

    if (!searchTerm.trim()) {
      if (filteredProducts !== products) {
        setFilteredProducts(products)
      }
      return
    }

    const lowercasedTerm = searchTerm.toLowerCase()

    const filtered = products.filter(product => {
      switch (searchBy) {
        case 'ID':
          return product.ID && product.ID.toString().includes(searchTerm)

        case 'title':
          return (
            product.title &&
            product.title.toLowerCase().includes(lowercasedTerm)
          )

        case 'category':
          return (
            product.category &&
            product.category.toLowerCase().includes(lowercasedTerm)
          )

        case 'brand':
          return (
            product.brand &&
            product.brand.toLowerCase().includes(lowercasedTerm)
          )

        case 'date':
          const createdAt = new Date(product.createdAt)
          const formattedDate = createdAt.toLocaleDateString('uz-UZ')
          const isoDate = createdAt.toISOString().split('T')[0]

          return (
            formattedDate.includes(searchTerm) || isoDate.includes(searchTerm)
          )

        case 'stock':
          return product.stock.toString().includes(searchTerm)

        default:
          return false
      }
    })

    setFilteredProducts(filtered)
  }, [searchTerm, searchBy, products])

  const handleDelete = async id => {
    if (!window.confirm('Маҳсулотни ўчиришга ишончингиз комилми?')) return
    try {
      await Fetch.delete(`product/${id}`)
      mutate('/product')
    } catch (error) {
      alert(error.response?.data?.message || 'Маҳсулотни ўчириб бўлмади')
    }
  }

  const openAddModal = () => {
    setEditProductId(null)
    setIsModalOpen(true)
  }

  const openEditModal = id => {
    setEditProductId(id)
    setIsModalOpen(true)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  return (
    <div className='container min-h-screen overflow-y-auto px-4 py-6'>
      <br />
      <br />
      <div className='w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2 md:mb-0'>
          Маҳсулотлар рўйхати
        </h1>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchBy={searchBy}
          setSearchBy={setSearchBy}
        />

        <button
          onClick={openAddModal}
          className='w-full md:w-auto px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2'
        >
          <Plus className='h-4 w-4' />
          Янги маҳсулот
        </button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error.response.data.message} />
      ) : filteredProducts.length > 0 ? (
        <ProductTable
          products={filteredProducts}
          setSelectedProduct={setSelectedProduct}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
        />
      ) : (
        <EmptyState searchTerm={searchTerm} onClearSearch={clearSearch} />
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      <ProductModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        productId={editProductId}
      />
    </div>
  )
}
