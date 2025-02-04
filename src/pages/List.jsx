import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const ImageModal = ({ images, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
         onClick={onClose}>
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Product Images</h2>
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
  const [list, setList] = React.useState([]);
  const [editMode, setEditMode] = React.useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState([]);

  // Initialize formData using useReducer
  const [formData, dispatch] = useReducer(formDataReducer, []);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
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
    <>
      <p className='mb-2 text-sm md:text-base'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* Table Header */}
        <div className='hidden md:grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>
  
        <form>
          {/* Edit/Save Toggle */}
          <div className='px-2'>
            {editMode === false ? (
              <p
                onClick={() => {
                  setEditMode(true);
                  dispatch({ type: 'INITIALIZE', payload: list });
                }}
                className='text-right md:text-center cursor-pointer text-sm md:text-lg text-blue-600 hover:text-blue-800'
              >
                Edit Mode
              </p>
            ) : (
              <div className='flex justify-between items-center'>
                <p
                  onClick={() => setEditMode(false)}
                  className='cursor-pointer text-sm md:text-lg text-red-600 hover:text-red-800'
                >
                  Cancel
                </p>
                <p
                  onClick={() => editProduct()}
                  className='cursor-pointer text-sm md:text-lg text-green-600 hover:text-green-800'
                >
                  Save
                </p>
              </div>
            )}
          </div>
              
          {/* Product List */}
          {list.map((item, index) => (
            <div key={index} className='border rounded-lg p-2 mb-2'>
              {editMode === false ? (
                // View Mode
                <div className='md:grid md:grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] items-center gap-2'>
  <img
    className='w-16 mx-auto md:w-12 cursor-pointer'
    src={item.image[0]}
    alt=''
    onClick={() => handleImageClick(item.image)}
  />
                  <p className='font-semibold text-sm'>{item.name}</p>
                  <p className='text-xs text-gray-600'>{item.description}</p>
                  <p className='text-sm md:text-base'>{item.category}</p>
                  <p className='text-sm md:text-base'>{currency}{item.price}</p>
                  <div /> {/* Empty spacer for grid alignment */}
                </div>
              ) : (
                // Edit Mode
                <div className='md:grid md:grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] items-center gap-2'>
                    <img 
                    className='w-16 mx-auto md:w-12 cursor-pointer'
                    src={item.image[0]}
                    alt=''
                     onClick={() => handleImageClick(item.image)}
  />
                  
                  {/* Name Input */}
                  <input
                    name='name'
                    onChange={(e) => handleChange(item._id, index, e)}
                    defaultValue={item.name}
                    className='w-full p-1 text-sm border rounded'
                  />
                  
                  {/* Description Input */}
                  <input
                    name='description'
                    onChange={(e) => handleChange(item._id, index, e)}
                    defaultValue={item.description}
                    className='w-full p-1 text-sm border rounded'
                  />
                  
                  {/* Category Input */}
                  <input
                    name='category'
                    onChange={(e) => handleChange(item._id, index, e)}
                    defaultValue={item.category}
                    className='w-full p-1 text-sm border rounded'
                    type='text'
                  />
                  
                  {/* Price Input */}
                  <input
                    name='price'
                    onChange={(e) => handleChange(item._id, index, e)}
                    defaultValue={item.price}
                    className='w-full p-1 text-sm border rounded'
                    type='number'
                  />
                  
                  {/* Delete Button */}
                  <div className='text-center'>
                    <p
                      onClick={() => removeProduct(item._id)}
                      className='text-red-600 hover:text-red-800 cursor-pointer text-sm'
                    >
                      Delete
                    </p>
                  </div>
                </div>
              )}
              
            </div>
            
          ))}
        </form>
      </div>
      {showImageModal && (
        <ImageModal
          images={selectedProductImages}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </>
  );
}
export default List;