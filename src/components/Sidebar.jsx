import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  FaPlus, 
  FaListUl, 
  FaBoxes, 
  FaShoppingBag, 
  FaCog 
} from 'react-icons/fa'

const Sidebar = () => {
  const { t } = useTranslation()

  return (
    <div className='w-[18%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/add">
                <FaPlus className='w-5 h-5' />
                <p className='hidden md:block'>{t('sidebar.addItems')}</p>
            </NavLink>
            
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/categories">
                <FaBoxes className='w-5 h-5' />
                <p className='hidden md:block'>{t('sidebar.categories')}</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/list">
                <FaListUl className='w-5 h-5' />
                <p className='hidden md:block'>{t('sidebar.listItems')}</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/orders">
                <FaShoppingBag className='w-5 h-5' />
                <p className='hidden md:block'>{t('sidebar.orders')}</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/settings">
                <FaCog className='w-5 h-5' />
                <p className='hidden md:block'>{t('sidebar.settings')}</p>
            </NavLink>

        </div>

    </div>
  )
}

export default Sidebar