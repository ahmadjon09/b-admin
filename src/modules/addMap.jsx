import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { MapPinIcon as MapPinPlus, X, Loader2, Check } from 'lucide-react'
import L from 'leaflet'
import Fetch from '../middlewares/fetch'
import MarkerIcon from '../assets/pin.png'
import 'leaflet/dist/leaflet.css'
import { IsOpenModal } from '../assets/css/Modal'
import { mutate } from 'swr'
import { motion, AnimatePresence } from 'framer-motion'

const customIcon = new L.Icon({
  iconUrl: MarkerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

const center = { lat: 40.9983, lng: 71.6726 }

export const AddMap = ({ isOpen, setIsOpen }) => {
  const [marker, setMarker] = useState(null)
  const [mapData, setMapData] = useState({})
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = e => {
    const { name, value } = e.target
    setMapData(prevData => ({ ...prevData, [name]: value }))
  }

  const MapClickHandler = () => {
    useMapEvents({
      click: e => {
        setMarker({ lat: e.latlng.lat, lng: e.latlng.lng })
      }
    })
    return null
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (marker) {
      setIsPending(true)
      setError('')
      try {
        await Fetch.post('/map', { ...mapData, coordinates: marker })
        setSuccess(true)
        setTimeout(() => {
          setMarker(null)
          setIsOpen(false)
          IsOpenModal(false)
          mutate('/map')
        }, 1000)
      } catch (error) {
        setError(error.response?.data?.message || 'Хатолик юз берди')
      } finally {
        setIsPending(false)
      }
    } else {
      setError('Илтимос, харитага жойни белгиланг')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='fixed z-[9999] inset-0 bg-black/70 backdrop-blur-sm flex justify-end items-center'
          onClick={() => {
            setIsOpen(false)
            IsOpenModal(false)
          }}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className='w-full h-full max-w-md md:max-w-lg bg-white shadow-2xl overflow-y-auto'
            onClick={e => e.stopPropagation()}
          >
            <div className='sticky top-0 z-[9999] bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center'>
              <h1 className='text-xl font-bold text-white flex items-center gap-2'>
                <MapPinPlus className='h-5 w-5' /> Янги жой қўшиш
              </h1>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsOpen(false)
                  IsOpenModal(false)
                }}
                className='text-white hover:bg-white/20 rounded-full p-1 transition-colors'
              >
                <X className='h-5 w-5' />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className='p-4 md:p-6'>
              <div className='mb-6 relative rounded-xl overflow-hidden shadow-lg border-4 border-purple-200'>
                <MapContainer
                  center={center}
                  zoom={10}
                  className='w-full h-[300px]'
                >
                  <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                  <MapClickHandler />
                  {marker && (
                    <Marker
                      icon={customIcon}
                      position={[marker.lat, marker.lng]}
                    />
                  )}
                </MapContainer>

                {!marker && (
                  <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-purple-200 text-purple-700 text-sm font-medium animate-pulse'>
                    Жойни белгилаш учун харитага босинг
                  </div>
                )}
              </div>

              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label
                      htmlFor='name'
                      className='text-sm font-medium text-gray-700'
                    >
                      Жой номи
                    </label>
                    <input
                      id='name'
                      type='text'
                      placeholder='Жой номини киритинг'
                      name='name'
                      onChange={handleInputChange}
                      required
                      className='w-full border border-purple-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200'
                    />
                  </div>

                  <div className='space-y-2'>
                    <label
                      htmlFor='mapsName'
                      className='text-sm font-medium text-gray-700'
                    >
                      Кўча номи
                    </label>
                    <input
                      id='mapsName'
                      type='text'
                      placeholder='Кўча номини киритинг'
                      name='mapsName'
                      onChange={handleInputChange}
                      required
                      className='w-full border border-purple-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label
                    htmlFor='mapsPhone'
                    className='text-sm font-medium text-gray-700'
                  >
                    Телефон рақами
                  </label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                      +(998)
                    </span>
                    <input
                      id='mapsPhone'
                      type='number'
                      placeholder='Телефон рақамини киритинг'
                      name='mapsPhone'
                      onChange={handleInputChange}
                      required
                      className='w-full border border-purple-200 p-3 pl-16 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label
                    htmlFor='mapsTime'
                    className='text-sm font-medium text-gray-700'
                  >
                    Иш вақти
                  </label>
                  <input
                    id='mapsTime'
                    type='text'
                    placeholder='масалан: 09:00-18:00'
                    name='mapsTime'
                    onChange={handleInputChange}
                    required
                    className='w-full border border-purple-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200'
                  />
                </div>

                {error && (
                  <div className='bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 flex items-start'>
                    <span className='mr-2'>⚠️</span>
                    {error}
                  </div>
                )}

                <div className='grid grid-cols-2 gap-4 mt-6'>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type='button'
                    onClick={() => {
                      setIsOpen(false)
                      IsOpenModal(false)
                    }}
                    className='bg-gray-100 rounded-lg flex justify-center items-center gap-2 text-gray-700 py-3 font-medium hover:bg-gray-200 transition-colors'
                  >
                    Бекор қилиш
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#6d28d9' }}
                    whileTap={{ scale: 0.98 }}
                    type='submit'
                    disabled={isPending || success}
                    className={`rounded-lg flex justify-center items-center gap-2 text-white py-3 font-medium transition-all ${
                      isPending || success
                        ? 'bg-purple-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className='h-4 w-4 animate-spin' />{' '}
                        Сақланмоқда...
                      </>
                    ) : success ? (
                      <>
                        <Check className='h-4 w-4' /> Сақланди!
                      </>
                    ) : (
                      'Жойни сақлаш'
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
