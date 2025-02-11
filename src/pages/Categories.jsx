import React, { useEffect, useState } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'


const Categories = ({token, categories}) => {
  
  
  return (
    <div>
{Array.from(new Set(categories.map(item => item.category)))
  .map((category, index) => (
    <div className='border rounded-lg p-2 mb-2' key={category}>{category}</div>
))}
    </div>
  )
}

export default Categories