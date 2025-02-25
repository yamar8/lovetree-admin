import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ImageModal = ({ images, onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
         onClick={onClose}>
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('list.productImages')}</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.filter(Boolean).map((img, index) => (
            <img 
              key={index}
              src={img}
              alt={`Product view ${index + 1}`}
              className="w-full h-32 object-cover rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
};


// Reducer function to manage formData state
const formDataReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      const { index, name, value, _id } = action.payload; // Destructure `_id` (not `id`)
      const updatedFormData = [...state];
      updatedFormData[index] = {
        ...updatedFormData[index],
        [name]: value,
        _id: _id, // Use `_id` here
      };
      return updatedFormData;

    case 'INITIALIZE':
      return action.payload;

    case 'RESET':
      return [];

    default:
      return state;
  }
};

const List = ({ token }) => {
  const { t } = useTranslation();
  const [list, setList] = React.useState([]);
  const [editMode, setEditMode] = React.useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState([]);

  // Initialize formData using useReducer
  const [formData, dispatch] = useReducer(formDataReducer, []);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list',{ headers: { token } });
      console.log("response: ", response)
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const editProduct = async () => {
    console.log(formData);

    try {
      const response = await axios.post(
        backendUrl + '/api/product/edit',
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchList();
        setEditMode(false);
        dispatch({ type: 'RESET' }); // Reset formData after saving
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleChange = (_id, index, e) => { // Use `_id` as the parameter name
    const { name, value } = e.target;
    dispatch({
      type: 'UPDATE_FIELD',
      payload: { index, name, value, _id }, // Pass `_id` here
    });
  };

  const handleImageClick = (images) => {
    setSelectedProductImages(images);
    setShowImageModal(true);
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{t('list.allProducts')}</h1>
        {editMode === false ? (
          <button
            onClick={() => {
              setEditMode(true);
              dispatch({ type: 'INITIALIZE', payload: list });
            }}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {t('list.editMode')}
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => setEditMode(false)}
              className="text-gray-600 hover:text-gray-700 font-medium transition-colors"
            >
              {t('list.cancel')}
            </button>
            <button
              onClick={() => editProduct()}
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              {t('list.save')}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Labels - Only visible on small screens */}
      <div className="block md:hidden bg-gray-50 px-4 py-2 rounded-t-lg">
        <p className="text-sm font-medium text-gray-700">{t('list.allProducts')}</p>
      </div>

      {/* Desktop Table Header - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] items-center py-3 px-4 bg-gray-50 rounded-t-lg border-b">
        <span className="font-semibold text-gray-700">{t('list.image')}</span>
        <span className="font-semibold text-gray-700">{t('list.name')}</span>
        <span className="font-semibold text-gray-700">{t('list.description')}</span>
        <span className="font-semibold text-gray-700">{t('list.category')}</span>
        <span className="font-semibold text-gray-700">{t('list.price')}</span>
        <span className="font-semibold text-gray-700 text-center">{t('list.action')}</span>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-b-lg shadow-sm">
        {list.map((item, index) => (
          <div key={index} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
            {editMode === false ? (
              // View Mode
              <div className="flex flex-col md:grid md:grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] gap-3 p-4">
                {/* Mobile Layout */}
                <div className="flex items-center gap-4 md:block">
                  <img
                    className="w-20 h-20 md:w-16 md:h-16 object-cover rounded-lg cursor-pointer"
                    src={item.image[0]}
                    alt=""
                    onClick={() => handleImageClick(item.image)}
                  />
                  <div className="flex flex-col gap-1 md:hidden">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">{currency}{item.price}</p>
                  </div>
                </div>
                
                {/* Desktop Only Fields */}
                <p className="hidden md:block font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-gray-700">{item.category}</p>
                <p className="hidden md:block text-gray-700">{currency}{item.price}</p>
                <div />
              </div>
            ) : (
              // Edit Mode
              <div className="flex flex-col gap-4 p-4 md:grid md:grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] md:gap-4">
                <img
                  className="w-20 h-20 md:w-16 md:h-16 object-cover rounded-lg cursor-pointer mx-auto md:mx-0"
                  src={item.image[0]}
                  alt=""
                  onClick={() => handleImageClick(item.image)}
                />
                
                {/* Mobile Labels */}
                <div className="flex flex-col gap-3 md:contents">
                  <div className="md:hidden">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('list.name')}</label>
                    <input
                      name="name"
                      onChange={(e) => handleChange(item._id, index, e)}
                      defaultValue={item.name}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  {/* Desktop Input - Hidden on mobile */}
                  <input
                    name="name"
                    onChange={(e) => handleChange(item._id, index, e)}
                    defaultValue={item.name}
                    className="hidden md:block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />

                  <div className="md:hidden">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('list.description')}</label>
                    <input
                      name="description"
                      onChange={(e) => handleChange(item._id, index, e)}
                      defaultValue={item.description}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <input
                    name="description"
                    onChange={(e) => handleChange(item._id, index, e)}
                    defaultValue={item.description}
                    className="hidden md:block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />

                  <div className="md:hidden">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('list.category')}</label>
                    <input
                      name="category"
                      onChange={(e) => handleChange(item._id, index, e)}
                      defaultValue={item.category}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <input
                    name="category"
                    onChange={(e) => handleChange(item._id, index, e)}
                    defaultValue={item.category}
                    className="hidden md:block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />

                  <div className="md:hidden">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('list.price')}</label>
                    <input
                      name="price"
                      type="number"
                      onChange={(e) => handleChange(item._id, index, e)}
                      defaultValue={item.price}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <input
                    name="price"
                    type="number"
                    onChange={(e) => handleChange(item._id, index, e)}
                    defaultValue={item.price}
                    className="hidden md:block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <button
                  onClick={() => removeProduct(item._id)}
                  className="text-red-600 hover:text-red-700 font-medium transition-colors text-center w-full md:w-auto"
                >
                  {t('list.delete')}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showImageModal && (
        <ImageModal
          images={selectedProductImages}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
};

export default List;