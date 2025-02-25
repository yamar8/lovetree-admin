import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';

// List of RTL languages
const RTL_LANGUAGES = ['he', 'ar', 'fa'];

// Function to set document direction
const setDocumentDirection = (language) => {
  const dir = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
  document.dir = dir;
  document.documentElement.setAttribute('dir', dir);
  // Optional: Add a class to help with CSS targeting
  document.documentElement.className = dir;
};

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      settings: {
        title: "Settings",
        language: "Language",
        preferences: "Preferences"
      },
      home: "HOME",
      productName: "Product name",
      productDescription: "Product description",
      addProduct: {
        uploadImage: "Upload Image",
        productName: "Product name",
        productDescription: "Product description",
        productCategory: "Product category",
        subCategory: "Sub category",
        productPrice: "Product Price",
        productSizes: "Product Sizes",
        addToBestseller: "Add to bestseller",
        add: "ADD",
        newCategory: "New Category...",
        addNewCategory: "Add New Category",
        enterNewCategory: "Enter new category",
        cancel: "Cancel",
        save: "Save",
        typeHere: "Type here",
        writeContentHere: "Write content here"
      },
      list: {
        allProducts: "All Products List",
        image: "Image",
        name: "Name",
        description: "Description",
        category: "Category",
        price: "Price",
        action: "Action",
        editMode: "Edit Mode",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        productImages: "Product Images"
      },
      orders: {
        orderPage: "Order Page",
        items: "Items",
        method: "Method",
        payment: "Payment",
        date: "Date",
        done: "Done",
        pending: "Pending",
        status: {
          orderPlaced: "Order Placed",
          packing: "Packing",
          shipped: "Shipped",
          outForDelivery: "Out for delivery",
          delivered: "Delivered"
        }
      },
      categories: {
        title: "Categories",
        addNew: "Add New Category",
        name: "Category Name",
        add: "Add",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        enterName: "Enter category name",
        editCategory: "Edit Category",
        confirmDelete: "Are you sure you want to delete this category?",
        yes: "Yes",
        no: "No"
      },
      sidebar: {
        addItems: "Add Items",
        categories: "Categories",
        listItems: "List Items",
        orders: "Orders",
        settings: "Settings"
      },
      navbar: {
        logout: "Logout",
        welcome: "Welcome"
      }
    }
  },
  he: {
    translation: {
      settings: {
        title: "הגדרות",
        language: "שפה",
        preferences: "העדפות"
      },
      home: "בית",
      productName: "שם המוצר",
      productDescription: "תיאור המוצר",
      addProduct: {
        uploadImage: "העלה תמונה",
        productName: "שם המוצר",
        productDescription: "תיאור המוצר",
        productCategory: "קטגוריית מוצר",
        subCategory: "קטגוריית משנה",
        productPrice: "מחיר המוצר",
        productSizes: "מידות המוצר",
        addToBestseller: "הוסף לרבי מכר",
        add: "הוסף",
        newCategory: "קטגוריה חדשה...",
        addNewCategory: "הוסף קטגוריה חדשה",
        enterNewCategory: "הכנס קטגוריה חדשה",
        cancel: "ביטול",
        save: "שמור",
        typeHere: "הקלד כאן",
        writeContentHere: "כתוב תוכן כאן"
      },
      list: {
        allProducts: "רשימת כל המוצרים",
        image: "תמונה",
        name: "שם",
        description: "תיאור",
        category: "קטגוריה",
        price: "מחיר",
        action: "פעולה",
        editMode: "מצב עריכה",
        cancel: "ביטול",
        save: "שמור",
        delete: "מחק",
        productImages: "תמונות מוצר"
      },
      orders: {
        orderPage: "דף הזמנות",
        items: "פריטים",
        method: "שיטה",
        payment: "תשלום",
        date: "תאריך",
        done: "בוצע",
        pending: "ממתין",
        status: {
          orderPlaced: "ההזמנה התקבלה",
          packing: "באריזה",
          shipped: "נשלח",
          outForDelivery: "במשלוח",
          delivered: "נמסר"
        }
      },
      categories: {
        title: "קטגוריות",
        addNew: "הוסף קטגוריה חדשה",
        name: "שם הקטגוריה",
        add: "הוסף",
        cancel: "ביטול",
        edit: "ערוך",
        delete: "מחק",
        save: "שמור",
        enterName: "הכנס שם קטגוריה",
        editCategory: "ערוך קטגוריה",
        confirmDelete: "האם אתה בטוח שברצונך למחוק קטגוריה זו?",
        yes: "כן",
        no: "לא"
      },
      sidebar: {
        addItems: "הוסף פריטים",
        categories: "קטגוריות",
        listItems: "רשימת פריטים",
        orders: "הזמנות",
        settings: "הגדרות"
      },
      navbar: {
        logout: "התנתק",
        welcome: "ברוך הבא"
      }
    }
  }
};

i18next
  .use(i18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    resources: resources
  });

// Set initial direction
setDocumentDirection(i18next.language);

// Listen for language changes
i18next.on('languageChanged', (lng) => {
  setDocumentDirection(lng);
});

export default i18next;
