'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Upload, Loader2, Save, Trash2, Plus, Package } from 'lucide-react'
import Fetch from '../middlewares/fetch'
import { mutate } from 'swr'
import { IsOpenModal } from '../assets/css/Modal'

export const ProductModal = ({ isOpen, setIsOpen, productId = null }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imagePending, setImagePending] = useState(false)
  const fileInputRef = useRef(null)
  const isEditMode = !!productId

  const [productData, setProductData] = useState({
    title: '',
    description: 'N/A',
    ID: '',
    category: '',
    brand: '',
    variants: [],
    sale: 0,
    selled_count: 0,
    photos: [],
    ingredients: [],
    flavors: [],
    expiryDate: '',
    rating: 5
  })

  const [newVariant, setNewVariant] = useState({
    color: {
      name: '',
      value: '#000000'
    },
    weight: '',
    price: '',
    stock: 0
  })

  const [newIngredient, setNewIngredient] = useState('')
  const [newFlavor, setNewFlavor] = useState({
    name: '',
    ingredients: [],
    price: '',
    stock: 0
  })
  const [newFlavorIngredient, setNewFlavorIngredient] = useState('')
  const [previewImages, setPreviewImages] = useState([])

  useEffect(() => {
    if (isEditMode && isOpen) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true)
          setError('')
          const { data } = await Fetch.get(`/product/one/${productId}`)
          const product = data.data

          setProductData({
            title: product.title || '',
            description: product.description || 'N/A',
            ID: product.ID || '',
            category: product.category || '',
            brand: product.brand || '',
            variants: product.variants || [],
            sale: product.sale || 0,
            selled_count: product.selled_count || 0,
            photos: product.photos || [],
            ingredients: product.ingredients || [],
            flavors: product.flavors || [],
            expiryDate: product.expiryDate
              ? new Date(product.expiryDate).toISOString().split('T')[0]
              : '',
            rating: product.rating || 5
          })
          setPreviewImages(product.photos || [])
        } catch (err) {
          setError(
            err.response?.data?.message || 'Маҳсулотни юклашда хатолик юз берди'
          )
        } finally {
          setIsLoading(false)
        }
      }
      fetchProduct()
    }
  }, [isEditMode, productId, isOpen])

  useEffect(() => {
    if (!isOpen && !isEditMode) {
      setProductData({
        title: '',
        description: 'N/A',
        ID: '',
        category: '',
        brand: '',
        variants: [],
        sale: 0,
        selled_count: 0,
        photos: [],
        ingredients: [],
        flavors: [],
        expiryDate: '',
        rating: 5
      })
      setPreviewImages([])
      setNewVariant({
        color: { name: '', value: '#000000' },
        weight: '',
        price: '',
        stock: 0
      })
      setNewIngredient('')
      setNewFlavor({ name: '', ingredients: [], price: '', stock: 0 })
      setNewFlavorIngredient('')
      setError('')
      setSuccess(false)
    }
  }, [isOpen, isEditMode])

  const handleInputChange = e => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = e => {
    const { name, value } = e.target
    const numValue = value === '' ? 0 : Number(value)
    setProductData(prev => ({ ...prev, [name]: numValue }))
  }

  const handleVariantInputChange = e => {
    const { name, value } = e.target
    if (name === 'colorName') {
      setNewVariant(prev => ({
        ...prev,
        color: { ...prev.color, name: value }
      }))
    } else if (name === 'colorValue') {
      setNewVariant(prev => ({
        ...prev,
        color: { ...prev.color, value: value }
      }))
    } else {
      setNewVariant(prev => ({ ...prev, [name]: value }))
    }
  }

  const addVariant = () => {
    if (!newVariant.price) {
      setError('Вариант нархини киритиш шарт')
      return
    }

    const variantToAdd = {
      color: newVariant.color.name ? newVariant.color : null,
      weight: newVariant.weight || null,
      price: Number(newVariant.price),
      stock: Number(newVariant.stock || 0)
    }

    setProductData(prev => ({
      ...prev,
      variants: [...prev.variants, variantToAdd]
    }))
    setNewVariant({
      color: { name: '', value: '#000000' },
      weight: '',
      price: '',
      stock: 0
    })
    setError('')
  }

  const removeVariant = index => {
    setProductData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }))
  }

  const addIngredient = () => {
    if (!newIngredient.trim()) {
      setError('Таркиб компонентини киритиш шарт')
      return
    }
    setProductData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient.trim()]
    }))
    setNewIngredient('')
    setError('')
  }

  const removeIngredient = index => {
    setProductData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const handleFlavorInputChange = e => {
    const { name, value } = e.target
    setNewFlavor(prev => ({ ...prev, [name]: value }))
  }

  const addFlavorIngredient = () => {
    if (!newFlavorIngredient.trim()) return
    setNewFlavor(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newFlavorIngredient.trim()]
    }))
    setNewFlavorIngredient('')
  }

  const removeFlavorIngredient = index => {
    setNewFlavor(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const addFlavor = () => {
    if (!newFlavor.name.trim()) {
      setError('Флавор номини киритиш шарт')
      return
    }
    if (!newFlavor.price) {
      setError('Флавор нархини киритиш шарт')
      return
    }
    setProductData(prev => ({
      ...prev,
      flavors: [
        ...prev.flavors,
        {
          ...newFlavor,
          price: Number(newFlavor.price),
          stock: Number(newFlavor.stock || 0)
        }
      ]
    }))
    setNewFlavor({ name: '', ingredients: [], price: '', stock: 0 })
    setError('')
  }

  const removeFlavor = index => {
    setProductData(prev => ({
      ...prev,
      flavors: prev.flavors.filter((_, i) => i !== index)
    }))
  }

  const handleFileChange = async e => {
    if (!e.target.files || e.target.files.length === 0) return

    const files = Array.from(e.target.files)
    const localPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...localPreviews])

    try {
      setImagePending(true)
      setError('')
      const uploadedUrls = []

      for (const file of files) {
        const formData = new FormData()
        formData.append('image', file)
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=955f1e37f0aa643262e734c080305b10`,
          {
            method: 'POST',
            body: formData
          }
        )
        const result = await res.json()
        if (result.success) {
          uploadedUrls.push(result.data.url)
        } else {
          throw new Error("Yuklash muvaffaqiyatsiz bo'ldi")
        }
      }

      setPreviewImages(prev => {
        const old = prev.slice(0, prev.length - files.length)
        return [...old, ...uploadedUrls]
      })

      setProductData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), ...uploadedUrls]
      }))
    } catch (err) {
      console.error(err)
      setError('Расмларни юклашда хатолик юз берди')
      setPreviewImages(prev => prev.slice(0, prev.length - files.length))
    } finally {
      setImagePending(false)
    }
  }

  const removeImage = index => {
    setProductData(prevData => ({
      ...prevData,
      photos: prevData.photos.filter((_, i) => i !== index)
    }))
    setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  const generateID = () => {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `PRD-${timestamp}-${randomStr}`.toUpperCase()
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!productData.title.trim()) {
      setError('Маҳсулот номини киритиш шарт')
      return
    }

    if (!productData.category.trim()) {
      setError('Категорияни киритиш шарт')
      return
    }

    if (productData.variants.length === 0) {
      setError('Камида битта вариант қўшиш шарт')
      return
    }

    if (productData.photos.length === 0) {
      setError('Камида битта расм юклаш шарт')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const dataToSubmit = {
        ...productData,
        ID: productData.ID || generateID(),
        sale: Number(productData.sale || 0),
        expiryDate: productData.expiryDate
          ? new Date(productData.expiryDate)
          : null
      }

      if (isEditMode) {
        await Fetch.put(`/product/${productId}`, dataToSubmit)
      } else {
        await Fetch.post('/product/create', dataToSubmit)
      }

      setSuccess(true)
      mutate('/product')
      setTimeout(() => {
        setIsOpen(false)
        IsOpenModal(false)
        setSuccess(false)
      }, 1500)
    } catch (err) {
      const action = isEditMode ? 'янгилашда' : 'қўшишда'
      setError(
        err.response?.data?.message || `Маҳсулотни ${action} хатолик юз берди`
      )
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const modalTitle = isEditMode ? 'Маҳсулотни таҳрирлаш' : 'Янги маҳсулот қўшиш'
  const buttonText = isEditMode ? 'Янгилаш' : 'Сақлаш'
  const successMessage = isEditMode
    ? 'Маҳсулот муваффақиятли янгиланди!'
    : 'Маҳсулот муваффақиятли қўшилди!'

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001] p-4'
      onClick={() => !isLoading && !imagePending && setIsOpen(false)}
    >
      <div
        className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'
        onClick={e => e.stopPropagation()}
      >
        {success ? (
          <div className='p-8 flex flex-col items-center justify-center'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-8 h-8 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-2'>
              {successMessage}
            </h3>
            <p className='text-gray-600'>
              Маҳсулотлар рўйхатига қайтарилмоқда...
            </p>
          </div>
        ) : (
          <>
            <div className='sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
              <h2 className='text-xl font-bold text-gray-900'>{modalTitle}</h2>
              <button
                onClick={() => !isLoading && !imagePending && setIsOpen(false)}
                className='text-gray-500 hover:text-gray-700 focus:outline-none'
                disabled={isLoading || imagePending}
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {isLoading && !productData.title ? (
              <div className='flex flex-col items-center justify-center p-12'>
                <Loader2 className='h-12 w-12 text-purple-600 animate-spin mb-4' />
                <p className='text-gray-600'>Юкланмоқда...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                  {/* Basic Information */}
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Маҳсулот номи <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='title'
                      value={productData.title}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Маҳсулот номини киритинг'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      ID{' '}
                      {!isEditMode && (
                        <span className='text-gray-500'>(автоматик)</span>
                      )}
                    </label>
                    <input
                      type='text'
                      name='ID'
                      value={productData.ID}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Автоматик генерация қилинади'
                      disabled={!isEditMode}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Категория <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='category'
                      value={productData.category}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Маҳсулот категорияси'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Бренд
                    </label>
                    <input
                      type='text'
                      name='brand'
                      value={productData.brand}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Маҳсулот бренди'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Чегирма (%)
                    </label>
                    <input
                      type='number'
                      name='sale'
                      value={productData.sale}
                      onChange={handleNumberInputChange}
                      min='0'
                      max='100'
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Чегирма фоизи'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Яроқлилик муддати
                    </label>
                    <input
                      type='date'
                      name='expiryDate'
                      value={productData.expiryDate}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Тавсиф
                    </label>
                    <textarea
                      name='description'
                      value={productData.description}
                      onChange={handleInputChange}
                      rows='3'
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Маҳсулот тавсифини киритинг'
                    />
                  </div>

                  {/* Variants section */}
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Вариантларни қўшиш <span className='text-red-500'>*</span>
                    </label>
                    <div className='grid grid-cols-1 md:grid-cols-6 gap-2 mb-2'>
                      <input
                        type='text'
                        name='colorName'
                        value={newVariant.color.name}
                        onChange={handleVariantInputChange}
                        className='p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        placeholder='Ранг номи'
                      />
                      <input
                        type='color'
                        name='colorValue'
                        value={newVariant.color.value}
                        onChange={handleVariantInputChange}
                        className='w-full h-10 border border-gray-300 rounded-md cursor-pointer'
                        title='Ранг танланг'
                      />
                      <input
                        type='text'
                        name='weight'
                        value={newVariant.weight}
                        onChange={handleVariantInputChange}
                        className='p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        placeholder='Ўлчам/Вазн'
                      />
                      <input
                        type='number'
                        name='price'
                        value={newVariant.price}
                        onChange={handleVariantInputChange}
                        className='p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        placeholder='Нарх *'
                      />
                      <input
                        type='number'
                        name='stock'
                        value={newVariant.stock}
                        onChange={handleVariantInputChange}
                        className='p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        placeholder='Захира'
                      />
                      <button
                        type='button'
                        onClick={addVariant}
                        className='px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'
                      >
                        <Plus className='h-5 w-5' />
                      </button>
                    </div>

                    {/* Display added variants */}
                    {productData.variants.length > 0 && (
                      <div className='mt-2'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>
                          Қўшилган вариантлар:
                        </p>
                        <div className='space-y-2'>
                          {productData.variants.map((variant, index) => (
                            <div
                              key={index}
                              className='flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2'
                            >
                              <div className='flex items-center gap-4'>
                                {variant.color && variant.color.name && (
                                  <div className='flex items-center gap-2'>
                                    <div
                                      className='w-4 h-4 rounded-full border border-gray-300'
                                      style={{
                                        backgroundColor: variant.color.value
                                      }}
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
                                <span className='text-sm font-medium'>
                                  {variant.price.toLocaleString()} сўм
                                </span>
                                <span className='text-sm text-gray-600'>
                                  Захира: {variant.stock}
                                </span>
                              </div>
                              <button
                                type='button'
                                onClick={() => removeVariant(index)}
                                className='text-red-500 hover:text-red-700'
                              >
                                <X className='h-4 w-4' />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ingredients section */}
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Таркиб (ихтиёрий)
                    </label>
                    <div className='flex gap-2 mb-2'>
                      <input
                        type='text'
                        value={newIngredient}
                        onChange={e => setNewIngredient(e.target.value)}
                        className='flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        placeholder='Таркиб компонентини киритинг'
                      />
                      <button
                        type='button'
                        onClick={addIngredient}
                        className='px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'
                      >
                        <Plus className='h-5 w-5' />
                      </button>
                    </div>

                    {productData.ingredients.length > 0 && (
                      <div className='mt-2'>
                        <div className='flex flex-wrap gap-2'>
                          {productData.ingredients.map((ingredient, index) => (
                            <div
                              key={index}
                              className='flex items-center gap-2 bg-orange-50 rounded-full px-3 py-1 border border-orange-200'
                            >
                              <Package className='w-3 h-3 text-orange-600' />
                              <span className='text-sm text-orange-700'>
                                {ingredient}
                              </span>
                              <button
                                type='button'
                                onClick={() => removeIngredient(index)}
                                className='text-orange-400 hover:text-red-500'
                              >
                                <X className='h-3 w-3' />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Flavors section */}
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Флаворлар (ихтиёрий)
                    </label>
                    <div className='border border-gray-200 rounded-lg p-4 mb-2'>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mb-2'>
                        <input
                          type='text'
                          name='name'
                          value={newFlavor.name}
                          onChange={handleFlavorInputChange}
                          className='p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                          placeholder='Флавор номи'
                        />
                        <input
                          type='number'
                          name='price'
                          value={newFlavor.price}
                          onChange={handleFlavorInputChange}
                          className='p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                          placeholder='Нарх'
                        />
                        <input
                          type='number'
                          name='stock'
                          value={newFlavor.stock}
                          onChange={handleFlavorInputChange}
                          className='p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                          placeholder='Захира'
                        />
                      </div>

                      <div className='flex gap-2 mb-2'>
                        <input
                          type='text'
                          value={newFlavorIngredient}
                          onChange={e => setNewFlavorIngredient(e.target.value)}
                          className='flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                          placeholder='Флавор таркиби'
                        />
                        <button
                          type='button'
                          onClick={addFlavorIngredient}
                          className='px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors'
                        >
                          <Plus className='h-4 w-4' />
                        </button>
                      </div>

                      {newFlavor.ingredients.length > 0 && (
                        <div className='flex flex-wrap gap-1 mb-2'>
                          {newFlavor.ingredients.map((ingredient, index) => (
                            <span
                              key={index}
                              className='inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs'
                            >
                              {ingredient}
                              <button
                                type='button'
                                onClick={() => removeFlavorIngredient(index)}
                                className='text-gray-500 hover:text-red-500'
                              >
                                <X className='h-3 w-3' />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <button
                        type='button'
                        onClick={addFlavor}
                        className='w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'
                      >
                        Флавор қўшиш
                      </button>
                    </div>

                    {productData.flavors.length > 0 && (
                      <div className='mt-2'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>
                          Қўшилган флаворлар:
                        </p>
                        <div className='space-y-2'>
                          {productData.flavors.map((flavor, index) => (
                            <div
                              key={index}
                              className='bg-purple-50 rounded-lg p-3 border border-purple-200'
                            >
                              <div className='flex items-center justify-between mb-2'>
                                <h4 className='font-medium text-purple-800'>
                                  {flavor.name}
                                </h4>
                                <button
                                  type='button'
                                  onClick={() => removeFlavor(index)}
                                  className='text-purple-400 hover:text-red-500'
                                >
                                  <X className='h-4 w-4' />
                                </button>
                              </div>
                              <div className='text-sm text-purple-700'>
                                <p>Нарх: {flavor.price.toLocaleString()} сўм</p>
                                <p>Захира: {flavor.stock}</p>
                                {flavor.ingredients.length > 0 && (
                                  <p>Таркиб: {flavor.ingredients.join(', ')}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Images section */}
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Расмлар <span className='text-red-500'>*</span>
                    </label>
                    <div
                      className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer'
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept='image/*'
                        className='hidden'
                      />
                      <div className='flex flex-col items-center'>
                        <Upload className='h-8 w-8 text-gray-400 mb-2' />
                        <p className='text-sm text-gray-600'>
                          Расмларни юклаш учун босинг ёки бу ерга тортиб ташланг
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          PNG, JPG, GIF форматлари қўллаб-қувватланади
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image previews */}
                {previewImages.length > 0 && (
                  <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Юкланган расмлар
                    </label>
                    <div className='grid grid-cols-3 sm:grid-cols-4 gap-3'>
                      {previewImages.map((img, index) => (
                        <div
                          key={index}
                          className='relative group rounded-md overflow-hidden border border-gray-200'
                        >
                          <img
                            src={img || '/placeholder.svg'}
                            alt={`Маҳсулот расми ${index + 1}`}
                            className='w-full h-24 object-cover'
                          />
                          <button
                            type='button'
                            onClick={() => removeImage(index)}
                            className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            <Trash2 className='h-3 w-3' />
                          </button>
                        </div>
                      ))}
                      {imagePending && (
                        <div className='flex items-center justify-center h-24 border border-gray-200 rounded-md bg-gray-50'>
                          <Loader2 className='h-6 w-6 text-purple-500 animate-spin' />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm'>
                    {error}
                  </div>
                )}

                <div className='flex justify-end gap-3'>
                  <button
                    type='button'
                    onClick={() =>
                      !isLoading && !imagePending && setIsOpen(false)
                    }
                    className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
                    disabled={isLoading || imagePending}
                  >
                    Бекор қилиш
                  </button>
                  <button
                    type='submit'
                    className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 ${
                      isLoading || imagePending
                        ? 'opacity-70 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={isLoading || imagePending}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Юкланмоқда...
                      </>
                    ) : (
                      <>
                        <Save className='h-4 w-4' />
                        {buttonText}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
