import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next';


const Add = ({ token, categories }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const {t} = useTranslation();

  const onSubmitHandler = async (e) => {
    e.preventDefault()
      setNewCategoryName('')
    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes))

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Handle category selection change. If "newCategory" is selected, open modal.
  const handleCategoryChange = (e) => {
    if (e.target.value === "newCategory") {
      setShowNewCategoryModal(true)
    } else {
      setCategory(e.target.value)
    }
  }

  return (
    <div>
      <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>{t('addProduct.uploadImage')}</p>
          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img
                className='w-20'
                src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
                alt=""
              />
              <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
            </label>
            <label htmlFor="image2">
              <img
                className='w-20'
                src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
                alt=""
              />
              <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
            </label>
            <label htmlFor="image3">
              <img
                className='w-20'
                src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
                alt=""
              />
              <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
            </label>
            <label htmlFor="image4">
              <img
                className='w-20'
                src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
                alt=""
              />
              <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>{t('addProduct.productName')}</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className='w-full max-w-[500px] px-3 py-2'
            type="text"
            placeholder={t('addProduct.typeHere')}
            required
          />
        </div>

        <div className='w-full'>
          <p className='mb-2'>{t('addProduct.productDescription')}</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className='w-full max-w-[500px] px-3 py-2'
            placeholder={t('addProduct.writeContentHere')}
            required
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-2'>{t('addProduct.productCategory')}</p>
            <select onChange={handleCategoryChange} className='w-full px-3 py-2'>
              <option defaultValue key="choose" value='choose'></option>
              {Array.from(new Set(categories.map(item => item.category))).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {
                newCategoryName &&
                <option key="newCategory" value='newCategoryName'>{newCategoryName}</option>
                
                
              }
              <option key="newCategory" value='newCategory'>New Category..</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>{t('addProduct.subCategory')}</p>
            <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>{t('addProduct.productPrice')}</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className='w-full px-3 py-2 sm:w-[120px]'
              type="number"
              placeholder='25'
            />
          </div>
        </div>

        <div>
          <p className='mb-2'>{t('addProduct.productSizes')}</p>
          <div className='flex gap-3'>
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
                  )
                }
              >
                <p
                  className={`${sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}
                >
                  {size}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
          <label className='cursor-pointer' htmlFor="bestseller">{t('addProduct.addToBestseller')}</label>
        </div>

        <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>{t('addProduct.add')}</button>
      </form>

      {/* Modal for New Category */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            <h2 className="text-xl font-bold mb-4">{t('addProduct.addNewCategory')}</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border p-2 w-full"
              placeholder={t('addProduct.enterNewCategory')}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowNewCategoryModal(false)
                  setNewCategoryName('')
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                {t('addProduct.cancel')}
              </button>
              <button
                onClick={() => {
                  if (newCategoryName.trim()) {
                    setCategory(newCategoryName)
                    setShowNewCategoryModal(false)
                  } else {
                    toast.error("Category name cannot be empty")
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {t('addProduct.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Add
