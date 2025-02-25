import React from 'react'
import {assets} from '../assets/assets'
import { useTranslation } from 'react-i18next'

const Navbar = ({setToken}) => {
  const { t } = useTranslation()

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="Logo" />
        <button 
          onClick={()=>setToken('')} 
          className='bg-gray-600 hover:bg-gray-700 transition-colors text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'
        >
          {t('navbar.logout')}
        </button>
    </div>
  )
}

export default Navbar