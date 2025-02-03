import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

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

  // Initialize formData using useReducer
  const [formData, dispatch] = useReducer(formDataReducer, []);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
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

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* ------- List Table Title ---------- */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>
        <form>
          {editMode === false ? (
            <p
              onClick={() => {
              setEditMode(true)
              dispatch({ type: 'INITIALIZE', payload: list }); // Initialize formData with list
              }}
              
              className='text-right md:text-center cursor-pointer text-lg'
            >
              Edit Mode
            </p>
          ) : (
            <p
              onClick={() => editProduct()}
              className='text-right md:text-center cursor-pointer text-lg'
            >
              Save
            </p>
          )}
          {/* ------ Product List ------ */}
          {list.map((item, index) => (
            <div key={index}>
              {editMode === false ? (
                <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'>
                  <img
                    className='w-12'
                    onClick={() => console.log('Yossef')}
                    src={item.image[0]}
                    alt=''
                  />
                  <div>
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                  </div>
                  <p>{item.category}</p>
                  <p>{currency}{item.price}</p>
                </div>
              ) : (
                <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm'>
                  <img className='w-12' src={item.image[0]} alt='' />
                  <div className='flex flex-col'>
                    <input
                      name='name'
                      onChange={(e) => handleChange(item._id, index, e)}
                      defaultValue={item.name}
                    />
                    <input
                      name='description'
                      onChange={(e) => handleChange(item._id, index, e)}
                      defaultValue={item.description}
                    />
                  </div>
                  <input
                    name='category'
                    onChange={(e) => handleChange(item._id, index, e)}
                    defaultValue={item.category}
                    className='w-full px-3 py-2 sm:w-[120px]'
                    type='text'
                  />
                  <input
                    name='price'
                    onChange={(e) => handleChange(item._id, index, e)}
                    defaultValue={item.price}
                    className='w-full px-3 py-2 sm:w-[120px]'
                    type='number'
                  />
                  <div>
                    <p
                      onClick={() => removeProduct(item._id)}
                      className='text-right md:text-center cursor-pointer text-lg'
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
    </>
  );
};

export default List;