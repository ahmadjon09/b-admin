import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Phone, X, Clock, MapPin, Loader2, Plus, RefreshCw } from 'lucide-react'
import Fetch from '../middlewares/fetch'
import useSWR, { mutate } from 'swr'
import { IsOpenModal } from '../assets/css/Modal'
import MarkerIcon from '../assets/pin.png'
import { motion, AnimatePresence } from 'framer-motion'
import { AddMap } from '../modules/addMap'

const center = { lat: 40.9983, lng: 71.6726 }

const customIcon = new L.Icon({
  iconUrl: MarkerIcon,
  iconSize: [42, 45],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

export const ViewMap = () => {
  const { data, error, isLoading } = useSWR('/map', Fetch)

  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [mapCenter, _] = useState(center)
  const [mapInstance, setMapInstance] = useState(null)

  useEffect(() => {
    if (selectedLocation && mapInstance) {
      const coords = selectedLocation.coordinates[0]
      mapInstance.flyTo([coords.lat, coords.lng], 14, {
        duration: 1
      })
    }
  }, [selectedLocation, mapInstance])

  const handleDelete = async id => {
    if (!window.confirm('Жойни ўчиришни истайсизми?')) return
    try {
      await Fetch.delete(`map/${id}`)
      mutate('/map')
    } catch (error) {
      alert(
        error.response?.data?.message || 'Жойни ўчириш муваффақиятсиз бўлди'
      )
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50'>
      <br />
      <div className='container mx-auto flex flex-col items-center gap-6 p-4 pb-[100px]'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full flex items-center justify-between pb-3 flex-wrap gap-3 border-b border-purple-200'
        >
          <h1 className='text-2xl font-bold text-gray-800 mb-2 md:mb-0'>
            Сақланган жойлар
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-200  transition-all flex items-center gap-2'
            onClick={() => {
              setIsOpen(true)
              IsOpenModal(true)
            }}
          >
            <Plus className='w-4 h-4' /> Жой қўшиш
          </motion.button>
        </motion.div>

        <div className='w-full flex flex-col lg:flex-row gap-6 items-start'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='flex flex-col items-center justify-start max-h-[450px] overflow-y-auto w-full lg:w-1/3 bg-white rounded-2xl shadow-xl p-4 border border-purple-100'
          >
            <h2 className='w-full text-xl font-semibold text-purple-700 mb-4 border-b border-purple-100 pb-2 flex items-center'>
              <span className='mr-2'>Менинг жойларим</span>
              {!isLoading && data.data?.length > 0 && (
                <span className='text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full'>
                  {data.data.length}
                </span>
              )}
            </h2>

            {isLoading ? (
              <div className='flex items-center justify-center w-full h-40'>
                <Loader2 className='w-8 h-8 text-purple-600 animate-spin' />
              </div>
            ) : data.data?.length > 0 ? (
              <AnimatePresence>
                {data.data.map((loc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full rounded-xl p-4 mb-3 relative cursor-pointer transition-all duration-300 border ${
                      selectedLocation?._id === loc._id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-100 hover:border-purple-200 bg-white'
                    }`}
                    onClick={() => setSelectedLocation(loc)}
                  >
                    <div className='font-medium text-lg relative'>
                      <h3 className='text-lg font-bold text-purple-700 mb-1 flex items-center gap-2'>
                        <MapPin className='w-4 h-4' />
                        {loc.name}
                      </h3>
                      <p className='text-sm text-gray-600 mb-1'>
                        {loc.mapsName}
                      </p>
                      <p className='text-sm text-gray-600 mb-1 flex items-center gap-1'>
                        <Phone className='w-3 h-3' />
                        <span>+(998) {loc.mapsPhone}</span>
                      </p>
                      <p className='text-sm text-gray-600 mb-2 flex items-center gap-1'>
                        <Clock className='w-3 h-3' />
                        <span>{loc.mapsTime}</span>
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#7c3aed' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={e => {
                          e.stopPropagation()
                          handleDelete(loc._id)
                        }}
                        className='flex absolute top-2 right-2 w-[24px] h-[24px] bg-purple-500 text-white items-center justify-center rounded-full shadow-sm hover:bg-purple-600 transition-colors'
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className='flex flex-col items-center justify-center w-full h-40 text-center'>
                <div className='text-5xl mb-2'>✨</div>
                <p className='text-gray-600 text-lg'>Ҳали жой қўшилмаган</p>
                <p className='text-purple-400 text-sm mt-2'>
                  Биринчи жойингизни қўшинг!
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='w-full lg:w-2/3'
          >
            {isLoading ? (
              <div className='w-full h-[400px] rounded-xl shadow-md border-4 border-purple-100 flex items-center justify-center bg-white'>
                <div className='flex flex-col items-center'>
                  <div className='relative'>
                    <div className='w-12 h-12 rounded-full border-4 border-t-purple-600 border-b-purple-300 border-l-purple-300 border-r-purple-300 animate-spin'></div>
                    <MapPin className='w-5 h-5 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
                  </div>
                  <p className='text-purple-600 mt-4'>Жойлар юкланмоқда...</p>
                </div>
              </div>
            ) : (
              <div className='relative rounded-xl overflow-hidden shadow-xl border-4 border-purple-200'>
                <MapContainer
                  center={mapCenter}
                  zoom={10}
                  className='w-full h-[500px] z-10'
                  whenCreated={setMapInstance}
                >
                  <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

                  {data.data?.map((loc, index) =>
                    loc.coordinates.map((coord, i) => (
                      <Marker
                        key={`${index}-${i}`}
                        position={[coord.lat, coord.lng]}
                        icon={customIcon}
                        eventHandlers={{
                          click: () => {
                            setSelectedLocation(loc)
                          }
                        }}
                      >
                        <Popup className='custom-popup'>
                          <div className='text-center p-1'>
                            <h2 className='font-bold text-purple-700 text-lg mb-2'>
                              {loc.name}
                            </h2>
                            <div className='flex items-start justify-center flex-col text-sm'>
                              <div className='flex items-center gap-1 mb-1'>
                                <Phone size={12} className='text-purple-600' />
                                <span>+(998) {loc.mapsPhone}</span>
                              </div>
                              <div className='flex items-center gap-1'>
                                <Clock size={12} className='text-purple-600' />
                                <span>{loc.mapsTime}</span>
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))
                  )}
                </MapContainer>

                <div className='absolute bottom-4 right-4 z-20 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg p-2 flex flex-col gap-2'>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => mapInstance?.setView(center, 10)}
                    className='p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                    title='Кўришни тиклаш'
                  >
                    <RefreshCw size={16} />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && <AddMap isOpen={isOpen} setIsOpen={setIsOpen} />}
      </AnimatePresence>

      <div className='lg:hidden fixed bottom-6 right-6 z-30'>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg flex items-center justify-center'
          onClick={() => {
            setIsOpen(true)
            IsOpenModal(true)
          }}
        >
          <Plus className='w-6 h-6' />
        </motion.button>
      </div>
    </div>
  )
}
