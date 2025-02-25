import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Categories = ({ token, categories, setCategories }) => {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAdd = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/category/add`,
        { category: newCategoryName },
        { headers: { token } }
      );
      if (response.data.success) {
        setCategories([...categories, response.data.category]);
        setNewCategoryName('');
        setShowAddModal(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/category/edit/${selectedCategory._id}`,
        { category: newCategoryName },
        { headers: { token } }
      );
      if (response.data.success) {
        setCategories(
          categories.map((cat) =>
            cat._id === selectedCategory._id ? { ...cat, category: newCategoryName } : cat
          )
        );
        setShowEditModal(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/category/delete/${selectedCategory._id}`,
        { headers: { token } }
      );
      if (response.data.success) {
        setCategories(categories.filter((cat) => cat._id !== selectedCategory._id));
        setShowDeleteModal(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">{t('categories.title')}</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('categories.addNew')}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">{category.category}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setNewCategoryName(category.category);
                    setShowEditModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {t('categories.edit')}
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowDeleteModal(true);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  {t('categories.delete')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{t('categories.addNew')}</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={t('categories.enterName')}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                {t('categories.cancel')}
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('categories.add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{t('categories.editCategory')}</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={t('categories.enterName')}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                {t('categories.cancel')}
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('categories.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{t('categories.confirmDelete')}</h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                {t('categories.no')}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                {t('categories.yes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;