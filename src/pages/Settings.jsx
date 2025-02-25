import React from 'react';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">{t('settings.title')}</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg text-gray-700 mb-6">{t('settings.language')}</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => changeLanguage('en')}
            className={`flex items-center justify-between px-6 py-3 rounded-lg border-2 transition-all duration-300 w-full sm:w-32
              ${i18n.language === 'en' 
                ? 'border-blue-500 bg-blue-500 text-white' 
                : 'border-gray-200 hover:border-blue-500 hover:bg-gray-50'}`}
          >
            <span className="text-base">English</span>
            <span className="text-sm opacity-80">EN</span>
          </button>
          
          <button 
            onClick={() => changeLanguage('he')}
            className={`flex items-center justify-between px-6 py-3 rounded-lg border-2 transition-all duration-300 w-full sm:w-32
              ${i18n.language === 'he' 
                ? 'border-blue-500 bg-blue-500 text-white' 
                : 'border-gray-200 hover:border-blue-500 hover:bg-gray-50'}`}
          >
            <span className="text-base">עברית</span>
            <span className="text-sm opacity-80">HE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
