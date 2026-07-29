import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineLogout, HiOutlineViewGrid, HiOutlineCube, HiOutlineShoppingCart, HiOutlineChat, HiOutlineSparkles, HiPlus, HiPencil, HiTrash, HiReply, HiX, HiMenu, HiEye, HiChevronDown, HiOutlineMail } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaWhatsapp } from 'react-icons/fa';


const CustomStatusDropdown = ({ value, options, onChange, type = "filter" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0, openUpwards: false });

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Allow clicking inside the portal
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('.status-dropdown-portal')
      ) {
        setIsOpen(false);
      }
    };
    
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Also attach scroll to any overflow containers to close dropdown on scroll
    const containers = document.querySelectorAll('.overflow-x-auto, .overflow-y-auto');
    containers.forEach(c => c.addEventListener('scroll', handleScroll, { passive: true }));

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      containers.forEach(c => c.removeEventListener('scroll', handleScroll));
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      
      let top = rect.bottom + window.scrollY;
      let openUpwards = false;
      
      if (spaceBelow < 150 && rect.top > 150) {
        openUpwards = true;
        top = rect.top + window.scrollY;
      }
      
      setDropdownCoords({
        top,
        left: rect.left + window.scrollX,
        width: rect.width,
        openUpwards
      });
    }
    setIsOpen(!isOpen);
  };

  const getStyleForValue = (val) => {
    if (type === "filter") return "text-[#5D4E42] font-semibold";
    if (val === "completed") return "text-emerald-700 font-bold";
    if (val === "contacted") return "text-blue-700 font-bold";
    return "text-amber-700 font-bold";
  };

  const getBgStyleForValue = (val) => {
    if (type === "filter") return "bg-transparent";
    if (val === "completed") return "bg-emerald-100";
    if (val === "contacted") return "bg-blue-100";
    return "bg-amber-100";
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div 
        onClick={toggleDropdown}
        className={`flex items-center justify-between cursor-pointer focus:outline-none transition-colors border ${
          type === "filter" 
            ? "bg-[#FFFFFF] border-[#E6DED2] rounded-xl px-4 py-2 text-[#5D4E42] hover:border-[#8E7A65] shadow-soft min-w-[140px]" 
            : type === "modal"
            ? `${getBgStyleForValue(value)} ${getStyleForValue(value)} border-${getStyleForValue(value).replace('text-', '')}/30 px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider min-w-[130px]`
            : `${getBgStyleForValue(value)} ${getStyleForValue(value)} border-transparent hover:border-[#5D4E42]/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider min-w-[120px]`
        }`}
      >
        <span>
          {options.find(opt => opt.value === value)?.label || value}
        </span>
        <HiChevronDown 
          className={`transition-transform duration-200 ml-2 ${isOpen ? 'rotate-180' : ''} ${getStyleForValue(value)}`} 
          size={type === "table" ? 14 : 16} 
        />
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: dropdownCoords.openUpwards ? 10 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: dropdownCoords.openUpwards ? 10 : -10 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top: `${dropdownCoords.top}px`,
                left: `${dropdownCoords.left}px`,
                width: type === "table" || type === "modal" ? '140px' : `${dropdownCoords.width}px`,
                zIndex: 9999,
                transform: dropdownCoords.openUpwards ? 'translateY(-100%)' : 'none',
                marginTop: dropdownCoords.openUpwards ? '-8px' : '8px'
              }}
              className="bg-[#FFFFFF] border border-[#E6DED2] rounded-xl shadow-soft-lg overflow-hidden py-1 status-dropdown-portal"
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#F8F4EC] transition-colors ${value === option.value ? 'bg-[#8E7A65] text-white font-semibold' : 'text-[#6F6A65]'}`}
                >
                  {option.label}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [analytics, setAnalytics] = useState({ totalVisitors: 0, months: [] });
  const [activeTooltip, setActiveTooltip] = useState(null);

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', shortDesc: '', fullDesc: '', ingredients: '', benefits: '',
    price: '', discountPrice: '', weight: '', skinType: '', amazonLink: '', flipkartLink: '', images: [''],
    internationalPrices: { USD: { price: '', discountPrice: '' }, EUR: { price: '', discountPrice: '' }, GBP: { price: '', discountPrice: '' } }
  });

  const [ingredients, setIngredients] = useState([]);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [ingredientForm, setIngredientForm] = useState({ name: '', desc: '', image: '', order: 0 });
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);

  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:5000/api/admin/check', { withCredentials: true });
        setIsAuthenticated(true);
      } catch (error) {
        navigate('/admin/login');
      } finally {
        setIsLoadingAuth(false);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === 'reviews') fetchReviews();
    if (activeTab === 'products' || activeTab === 'dashboard') fetchProducts();
    if (activeTab === 'orders' || activeTab === 'dashboard') fetchOrders();
    if (activeTab === 'ingredients' || activeTab === 'dashboard') fetchIngredients();
    if (activeTab === 'subscribers') fetchSubscribers();
    if (activeTab === 'dashboard') fetchAnalytics();
  }, [activeTab, isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders', { withCredentials: true });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/newsletter/subscribers', { withCredentials: true });
      setSubscribers(response.data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      try {
        await axios.delete(`http://localhost:5000/api/newsletter/subscribers/${id}`, { withCredentials: true });
        setSubscribers(subscribers.filter(sub => sub._id !== id));
      } catch (error) {
        console.error('Error deleting subscriber:', error);
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true });
      // Update local state to reflect change instantly
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews', { withCredentials: true });
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ingredients');
      setIngredients(response.data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics', { withCredentials: true });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/');
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`http://localhost:5000/api/reviews/${id}`, { withCredentials: true });
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleReplySubmit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/reviews/${id}/reply`, { adminReply: replyContent }, { withCredentials: true });
      setReplyingTo(null);
      setReplyContent('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', shortDesc: '', fullDesc: '', ingredients: '', benefits: '',
      price: '', discountPrice: '', weight: '', skinType: '', amazonLink: '', flipkartLink: '', images: [''],
      internationalPrices: { USD: { price: '', discountPrice: '' }, EUR: { price: '', discountPrice: '' }, GBP: { price: '', discountPrice: '' } }
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product._id);
    setProductForm({
      name: product.name || '',
      shortDesc: product.shortDesc || '',
      fullDesc: product.fullDesc || '',
      ingredients: product.ingredients || '',
      benefits: product.benefits || '',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      weight: product.weight || '',
      skinType: product.skinType || '',
      amazonLink: product.amazonLink || '',
      flipkartLink: product.flipkartLink || '',
      images: product.images?.length ? product.images : [''],
      internationalPrices: {
        USD: { price: product.internationalPrices?.USD?.price || '', discountPrice: product.internationalPrices?.USD?.discountPrice || '' },
        EUR: { price: product.internationalPrices?.EUR?.price || '', discountPrice: product.internationalPrices?.EUR?.discountPrice || '' },
        GBP: { price: product.internationalPrices?.GBP?.price || '', discountPrice: product.internationalPrices?.GBP?.discountPrice || '' }
      }
    });
    setIsAddModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const intlPrices = {};
      ['USD', 'EUR', 'GBP'].forEach(curr => {
        if (productForm.internationalPrices?.[curr]?.price) {
          intlPrices[curr] = {
            price: Number(productForm.internationalPrices[curr].price),
            discountPrice: productForm.internationalPrices[curr].discountPrice ? Number(productForm.internationalPrices[curr].discountPrice) : null
          };
        }
      });
      const payload = { 
        ...productForm, 
        images: productForm.images.filter(url => url.trim() !== ''),
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
        internationalPrices: intlPrices
      };
      
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct}`, payload, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/products', payload, { withCredentials: true });
      }
      setIsAddModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, { withCredentials: true });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...productForm.images];
    newImages[index] = value;
    setProductForm({ ...productForm, images: newImages });
  };
  
  const handleFileUpload = async (index, file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      handleImageChange(index, 'Uploading...');
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:5000/api/upload', formData, { 
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      handleImageChange(index, response.data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
      handleImageChange(index, '');
      const backendError = error.response?.data?.message || error.response?.data?.error || error.message || 'Unknown error';
      alert(`Failed to upload image: ${backendError}`);
    }
  };

  const addImageField = () => setProductForm({ ...productForm, images: [...productForm.images, ''] });
  const removeImageField = (index) => setProductForm({ ...productForm, images: productForm.images.filter((_, i) => i !== index) });

  const handleIngredientImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    try {
      setIngredientForm({ ...ingredientForm, image: 'Uploading...' });
      const formData = new FormData();
      formData.append('image', file);
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIngredientForm(prev => ({ ...prev, image: response.data.secure_url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setIngredientForm(prev => ({ ...prev, image: '' }));
      const backendError = error.response?.data?.message || error.response?.data?.error || error.message || 'Unknown error';
      alert(`Failed to upload image: ${backendError}`);
    }
  };

  const handleSaveIngredient = async (e) => {
    e.preventDefault();
    if (ingredientForm.image === 'Uploading...') {
      alert('Please wait for the image to finish uploading');
      return;
    }
    try {
      if (editingIngredient) {
        await axios.put(`http://localhost:5000/api/ingredients/${editingIngredient}`, ingredientForm, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/ingredients', ingredientForm, { withCredentials: true });
      }
      setIsIngredientModalOpen(false);
      setEditingIngredient(null);
      setIngredientForm({ name: '', desc: '', image: '', order: 0 });
      fetchIngredients();
    } catch (error) {
      console.error('Error saving ingredient:', error);
      alert('Failed to save ingredient');
    }
  };

  const handleDeleteIngredient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ingredient?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/ingredients/${id}`, { withCredentials: true });
      fetchIngredients();
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      alert('Failed to delete ingredient');
    }
  };

  const renderDashboard = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6DED2] shadow-soft">
          <h3 className="text-[#6F6A65] mb-2 font-medium text-sm">Total Products</h3>
          <p className="text-4xl font-serif font-bold text-[#5D4E42]">{products.length}</p>
        </div>
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6DED2] shadow-soft">
          <h3 className="text-[#6F6A65] mb-2 font-medium text-sm">Total Orders</h3>
          <p className="text-4xl font-serif font-bold text-[#5D4E42]">{orders.length}</p>
        </div>
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6DED2] shadow-soft">
          <h3 className="text-[#6F6A65] mb-2 font-medium text-sm">Monthly Visitors</h3>
          <p className="text-4xl font-serif font-bold text-[#5D4E42]">
            {analytics.months.length > 0 
              ? analytics.months[analytics.months.length - 1].uniqueVisitors 
              : 0}
          </p>
        </div>
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6DED2] shadow-soft">
          <h3 className="text-[#6F6A65] mb-2 font-medium text-sm">Total Visitors</h3>
          <p className="text-4xl font-serif font-bold text-[#5D4E42]">{analytics.totalVisitors}</p>
        </div>
      </div>

      {(() => {
        // Generate last 6 months data
        const chartData = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const monthStr = `${year}-${month}`;
          const existing = analytics.months.find(m => m.month === monthStr);
          chartData.push({
            monthStr,
            label: d.toLocaleString('default', { month: 'short' }),
            uniqueVisitors: existing ? existing.uniqueVisitors : 0
          });
        }
        
        // At least 10 for Y axis max to avoid looking empty when values are small
        const maxVisitors = Math.max(...chartData.map(d => d.uniqueVisitors), 10); 
        
        return (
          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6DED2] shadow-soft h-96 flex flex-col">
            <h3 className="text-[#5D4E42] mb-6 font-serif font-bold text-xl">Traffic Overview (Last 6 Months)</h3>
            <div className="flex-1 relative flex ml-6 mt-4">
              {/* Chart Area */}
              <div className="flex-1 border-b border-l border-[#E6DED2] relative flex items-end justify-around pb-0 mb-8">
                {/* Horizontal Grid lines and Y-axis labels */}
                {[0, 25, 50, 75, 100].map(percent => (
                  <div 
                    key={percent} 
                    className={`absolute w-full border-[#E6DED2]/60 pointer-events-none ${percent > 0 && percent < 100 ? 'border-t border-dashed' : ''}`} 
                    style={{ bottom: `${percent}%` }}
                  >
                    <span className="absolute -left-10 text-xs text-[#9D948B] w-8 text-right -translate-y-1/2">
                      {Math.round(maxVisitors * (percent / 100))}
                    </span>
                  </div>
                ))}
                
                {chartData.map((data) => {
                  const heightPercent = (data.uniqueVisitors / maxVisitors) * 100;
                  
                  return (
                    <div 
                      key={data.monthStr} 
                      className="flex flex-col items-center group h-full justify-end w-1/6 relative"
                      onClick={() => setActiveTooltip(activeTooltip === data.monthStr ? null : data.monthStr)}
                    >
                      <div className={`transition-opacity bg-[#5D4E42] border border-[#8E7A65] text-xs px-2.5 py-1.5 rounded-lg mb-2 absolute top-0 -mt-10 whitespace-nowrap z-10 pointer-events-none shadow-soft text-white ${activeTooltip === data.monthStr ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`}>
                        {data.uniqueVisitors} <span className="hidden sm:inline">visitors</span>
                      </div>
                      
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${Math.max(heightPercent, 1)}%` }} 
                        className={`w-8 sm:w-12 rounded-t-lg transition-all cursor-pointer relative z-0 ${data.uniqueVisitors > 0 ? (activeTooltip === data.monthStr ? 'bg-[#B88A5A] opacity-100' : 'bg-[#8E7A65] opacity-85 lg:group-hover:opacity-100') : 'bg-[#E6DED2]/50'}`}
                      ></motion.div>
                      
                      <div className="absolute -bottom-8 w-full text-center">
                        <span className="text-xs font-medium text-[#6F6A65]">{data.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </motion.div>
  );

  const renderProducts = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-[#5D4E42]">Manage Products</h2>
        <button 
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-[#B88A5A] hover:bg-[#9F7348] text-white px-4 py-2.5 rounded-full font-semibold transition-all duration-250 shadow-soft"
        >
          <HiPlus /> <span>Add Product</span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] overflow-x-auto shadow-soft">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#FDFBF7] border-b border-[#E6DED2]">
              <th className="p-4 text-[#6F6A65] font-semibold text-sm">Image</th>
              <th className="p-4 text-[#6F6A65] font-semibold text-sm">Name</th>
              <th className="p-4 text-[#6F6A65] font-semibold text-sm">Price</th>
              <th className="p-4 text-[#6F6A65] font-semibold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-[#E6DED2]/60 hover:bg-[#F8F4EC] transition-colors">
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F8F4EC]">
                    {product.images && product.images[0] && (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                </td>
                <td className="p-4 text-[#5D4E42] font-bold">{product.name}</td>
                <td className="p-4 text-[#5D4E42]">
                  {product.discountPrice ? (
                    <div>
                      <span className="text-[#9D948B] line-through text-sm mr-2">₹{product.price}</span>
                      <span className="text-[#5D4E42] font-bold">₹{product.discountPrice}</span>
                    </div>
                  ) : (
                    <span className="font-semibold">₹{product.price}</span>
                  )}
                </td>
                <td className="p-4 flex justify-end space-x-3 items-center h-full mt-2">
                  <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800 cursor-pointer"><HiPencil size={18} /></button>
                  <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-800 cursor-pointer"><HiTrash size={18} /></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-[#9D948B]">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {products.map((product) => (
          <div key={product._id} className="bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] p-4 shadow-soft flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F8F4EC] shrink-0">
                {product.images && product.images[0] && (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#5D4E42] font-bold truncate">{product.name}</h3>
                <div className="mt-1">
                  {product.discountPrice ? (
                    <>
                      <span className="text-[#9D948B] line-through text-sm mr-2">₹{product.price}</span>
                      <span className="text-[#5D4E42] font-semibold">₹{product.discountPrice}</span>
                    </>
                  ) : (
                    <span className="text-[#5D4E42] font-semibold">₹{product.price}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-[#E6DED2]/60">
              <button 
                onClick={() => openEditModal(product)} 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg bg-blue-50 transition-colors"
              >
                <HiPencil size={16} /> <span className="text-sm font-medium">Edit</span>
              </button>
              <button 
                onClick={() => handleDeleteProduct(product._id)} 
                className="flex items-center gap-2 text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg bg-red-50 transition-colors"
              >
                <HiTrash size={16} /> <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] p-8 text-center text-[#9D948B]">
            No products found.
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderOrders = () => {
    const filteredOrders = orders.filter(order => {
      const matchesStatus = orderFilter === 'All' || order.status.toLowerCase() === orderFilter.toLowerCase();
      
      let matchesDate = true;
      if (dateFilter) {
        // Compare the local date strings
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        matchesDate = orderDate === dateFilter;
      }
      
      return matchesStatus && matchesDate;
    });

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-serif font-bold text-[#5D4E42]">Direct Orders</h2>
          <div className="flex items-center gap-4">
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-[#FFFFFF] border border-[#E6DED2] text-[#5D4E42] px-4 py-2 rounded-xl focus:outline-none focus:border-[#B88A5A] shadow-soft"
            />
            <CustomStatusDropdown 
              value={orderFilter}
              onChange={setOrderFilter}
              type="filter"
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'completed', label: 'Completed' }
              ]}
            />
            {dateFilter && (
              <button 
                onClick={() => setDateFilter('')}
                className="text-sm font-medium text-[#8E7A65] hover:text-[#5D4E42] transition-colors"
              >
                Clear Date
              </button>
            )}
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] overflow-x-auto shadow-soft">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#FDFBF7] border-b border-[#E6DED2]">
                <th className="p-4 text-[#6F6A65] font-semibold text-sm">Order ID</th>
                <th className="p-4 text-[#6F6A65] font-semibold text-sm">Customer</th>
                <th className="p-4 text-[#6F6A65] font-semibold text-sm">Product</th>
                <th className="p-4 text-[#6F6A65] font-semibold text-sm">Date</th>
                <th className="p-4 text-[#6F6A65] font-semibold text-sm">Status</th>
                <th className="p-4 text-[#6F6A65] font-semibold text-sm text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b border-[#E6DED2]/60 hover:bg-[#F8F4EC] transition-colors">
                  <td className="p-4 text-[#5D4E42] font-mono font-bold text-sm">{order._id.substring(order._id.length - 6)}</td>
                  <td className="p-4 text-[#5D4E42]">
                    <div className="font-bold text-[#5D4E42]">{order.name}</div>
                  </td>
                  <td className="p-4 text-[#5D4E42]">
                    <div className="truncate max-w-[200px]" title={order.items && order.items.length > 0 ? order.items.map(i => `${i.product} (x${i.quantity})`).join(', ') : `${order.product} (x${order.quantity})`}>
                      {order.items && order.items.length > 0 ? order.items.map(i => `${i.product} (x${i.quantity})`).join(', ') : `${order.product} (x${order.quantity})`}
                    </div>
                  </td>
                  <td className="p-4 text-[#6F6A65]">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <CustomStatusDropdown 
                      value={order.status}
                      onChange={(newStatus) => handleStatusChange(order._id, newStatus)}
                      type="table"
                      options={[
                        { value: 'pending', label: 'PENDING' },
                        { value: 'contacted', label: 'CONTACTED' },
                        { value: 'completed', label: 'COMPLETED' }
                      ]}
                    />
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#8E7A65] hover:text-[#5D4E42] transition-colors"
                      title="View Details"
                    >
                      <HiEye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#9D948B]">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] p-4 shadow-soft flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[#5D4E42] font-bold">{order.name}</h3>
                  <p className="text-[#9D948B] font-mono text-xs mt-1">ID: {order._id.substring(order._id.length - 6)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[#6F6A65] text-sm block">{new Date(order.createdAt).toLocaleDateString()}</span>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1 text-[#8E7A65] hover:text-[#5D4E42] transition-colors mt-2 bg-[#F8F4EC] px-2.5 py-1 rounded-lg text-xs font-medium"
                  >
                    <HiEye size={14} /> <span>Details</span>
                  </button>
                </div>
              </div>
              <div className="py-3 border-y border-[#E6DED2]/60">
                <p className="text-[#5D4E42] text-sm">
                  <span className="text-[#9D948B]">Products:</span>{' '}
                  {order.items && order.items.length > 0 ? order.items.map(i => `${i.product} (x${i.quantity})`).join(', ') : `${order.product} (x${order.quantity})`}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#6F6A65]">Status:</span>
                <CustomStatusDropdown 
                  value={order.status}
                  onChange={(newStatus) => handleStatusChange(order._id, newStatus)}
                  type="table"
                  options={[
                    { value: 'pending', label: 'PENDING' },
                    { value: 'contacted', label: 'CONTACTED' },
                    { value: 'completed', label: 'COMPLETED' }
                  ]}
                />
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] p-8 text-center text-[#9D948B]">
              No orders found.
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderReviews = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-[#5D4E42]">Manage Reviews</h2>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] overflow-x-auto shadow-soft">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#FDFBF7] border-b border-[#E6DED2]">
              <th className="p-4 text-[#6F6A65] font-semibold text-sm">User</th>
              <th className="p-4 text-[#6F6A65] font-semibold text-sm">Rating</th>
              <th className="p-4 text-[#6F6A65] font-semibold text-sm">Review</th>
              <th className="p-4 text-[#6F6A65] font-semibold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <React.Fragment key={review._id}>
                <tr className="border-b border-[#E6DED2]/60 hover:bg-[#F8F4EC] transition-colors">
                  <td className="p-4 text-[#5D4E42] font-bold whitespace-nowrap align-top">{review.user?.name || 'Anonymous User'}</td>
                  <td className="p-4 align-top">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`text-sm ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-[#5D4E42] max-w-md align-top">
                    <p className="mb-2">{review.content}</p>
                    {review.adminReply && (
                      <div className="bg-[#F8F4EC] border-l-2 border-[#8E7A65] p-3 text-sm text-[#6F6A65] mt-2 rounded-lg">
                        <strong className="text-[#5D4E42] block mb-1">Your Reply:</strong> {review.adminReply}
                      </div>
                    )}
                  </td>
                  <td className="p-4 flex justify-end space-x-3 align-top">
                    <button 
                      onClick={() => {
                        setReplyingTo(replyingTo === review._id ? null : review._id);
                        setReplyContent(review.adminReply || '');
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                      title="Reply"
                    >
                      <HiReply size={18} />
                    </button>
                    <button onClick={() => handleDeleteReview(review._id)} className="text-red-600 hover:text-red-800 cursor-pointer" title="Delete">
                      <HiTrash size={18} />
                    </button>
                  </td>
                </tr>
                {replyingTo === review._id && (
                  <tr className="bg-[#FDFBF7]">
                    <td colSpan="4" className="p-4 border-b border-[#E6DED2]">
                      <div className="flex space-x-4">
                        <input 
                          type="text" 
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Type your reply here..." 
                          className="flex-1 bg-[#FFFFFF] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]"
                        />
                        <button 
                          onClick={() => handleReplySubmit(review._id)}
                          className="px-6 py-2.5 bg-[#B88A5A] hover:bg-[#9F7348] text-white font-semibold rounded-full transition-all duration-250 shadow-soft"
                        >
                          Save Reply
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-[#9D948B]">No reviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {reviews.map((review) => (
          <div key={review._id} className="bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] p-4 shadow-soft flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <h3 className="text-[#5D4E42] font-bold">{review.user?.name || 'Anonymous User'}</h3>
              <div className="flex space-x-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`text-xs ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            <p className="text-[#5D4E42] text-sm">{review.content}</p>
            {review.adminReply && (
              <div className="bg-[#F8F4EC] border-l-2 border-[#8E7A65] p-3 text-sm text-[#6F6A65] rounded-lg">
                <strong className="text-[#5D4E42] block mb-1">Your Reply:</strong> {review.adminReply}
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-3 border-t border-[#E6DED2]/60 mt-2">
              <button 
                onClick={() => {
                  setReplyingTo(replyingTo === review._id ? null : review._id);
                  setReplyContent(review.adminReply || '');
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg bg-blue-50 transition-colors"
              >
                <HiReply size={16} /> <span className="text-sm font-medium">Reply</span>
              </button>
              <button 
                onClick={() => handleDeleteReview(review._id)} 
                className="flex items-center gap-2 text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg bg-red-50 transition-colors"
              >
                <HiTrash size={16} /> <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
            
            {replyingTo === review._id && (
              <div className="flex flex-col gap-2 mt-2">
                <input 
                  type="text" 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply here..." 
                  className="w-full bg-[#FFFFFF] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] text-sm focus:outline-none focus:border-[#B88A5A]"
                />
                <button 
                  onClick={() => handleReplySubmit(review._id)}
                  className="px-4 py-2.5 bg-[#B88A5A] hover:bg-[#9F7348] text-white font-semibold text-sm rounded-full transition-all duration-250 w-full shadow-soft"
                >
                  Save Reply
                </button>
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] p-8 text-center text-[#9D948B]">
            No reviews found.
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderSubscribers = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#5D4E42]">Newsletter Subscribers</h2>
          <p className="text-sm text-[#6F6A65]">Manage all users subscribed to the Vedalush newsletter</p>
        </div>
        <span className="bg-[#B88A5A] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-soft">
          {subscribers.length} {subscribers.length === 1 ? 'Subscriber' : 'Subscribers'}
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] overflow-x-auto shadow-soft">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#FDFBF7] border-b border-[#E6DED2]">
              <th className="p-4 text-[#6F6A65] font-semibold text-sm">Email Address</th>
              <th className="p-4 text-[#6F6A65] font-semibold text-sm">Subscribed Date</th>
              <th className="p-4 text-[#6F6A65] font-semibold text-sm">Status</th>
              <th className="p-4 text-[#6F6A65] font-semibold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr key={sub._id} className="border-b border-[#E6DED2]/60 hover:bg-[#F8F4EC] transition-colors">
                <td className="p-4 text-[#5D4E42] font-mono font-bold">{sub.email}</td>
                <td className="p-4 text-[#6F6A65]">
                  {new Date(sub.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sub.isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                    {sub.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDeleteSubscriber(sub._id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1 cursor-pointer"
                    title="Remove Subscriber"
                  >
                    <HiTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-[#9D948B]">No newsletter subscribers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {subscribers.map((sub) => (
          <div key={sub._id} className="bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] p-4 shadow-soft flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="text-[#5D4E42] font-mono text-sm break-all font-bold">{sub.email}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${sub.isActive ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                {sub.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#6F6A65] pt-2 border-t border-[#E6DED2]/60 mt-1">
              <span>{new Date(sub.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <button 
                onClick={() => handleDeleteSubscriber(sub._id)}
                className="text-red-600 hover:text-red-800 flex items-center space-x-1 py-1"
              >
                <HiTrash size={16} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
        {subscribers.length === 0 && (
          <div className="p-8 text-center text-[#9D948B] bg-[#FFFFFF] rounded-2xl border border-[#E6DED2]">
            No newsletter subscribers yet.
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderIngredients = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#5D4E42]">Manage Ingredients</h2>
          <p className="text-sm text-[#6F6A65]">Add, edit, or remove soap ingredients shown on the homepage</p>
        </div>
        <button 
          onClick={() => {
            setEditingIngredient(null);
            setIngredientForm({ name: '', desc: '', image: '', order: ingredients.length + 1 });
            setIsIngredientModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-[#B88A5A] hover:bg-[#9F7348] text-white px-4 py-2.5 rounded-full transition-all duration-250 shadow-soft font-semibold text-sm"
        >
          <HiPlus size={18} /> <span>Add New Ingredient</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ingredients.map((item) => (
          <div key={item._id} className="bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] overflow-hidden flex flex-col group relative shadow-soft">
            <div className="h-48 relative overflow-hidden bg-[#F8F4EC]">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 flex space-x-1">
                <button
                  onClick={() => {
                    setEditingIngredient(item._id);
                    setIngredientForm({ name: item.name, desc: item.desc, image: item.image, order: item.order || 0 });
                    setIsIngredientModalOpen(true);
                  }}
                  className="w-8 h-8 rounded-lg bg-[#5D4E42]/90 hover:bg-[#8E7A65] text-white flex items-center justify-center transition-colors shadow-soft"
                  title="Edit Ingredient"
                >
                  <HiPencil size={15} />
                </button>
                <button
                  onClick={() => handleDeleteIngredient(item._id)}
                  className="w-8 h-8 rounded-lg bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-soft"
                  title="Delete Ingredient"
                >
                  <HiTrash size={15} />
                </button>
              </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-serif text-[#5D4E42] font-bold mb-1">{item.name}</h3>
              <p className="text-sm text-[#6F6A65] leading-relaxed flex-grow">{item.desc}</p>
            </div>
          </div>
        ))}
        {ingredients.length === 0 && (
          <div className="col-span-full bg-[#FFFFFF] rounded-2xl border border-[#E6DED2] p-12 text-center text-[#9D948B]">
            No ingredients added yet. Click "Add New Ingredient" to get started!
          </div>
        )}
      </div>
    </motion.div>
  );

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4EC]">
        <div className="w-12 h-12 border-4 border-[#B88A5A] border-t-[#5D4E42] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F8F4EC] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#FFFFFF] border-b border-[#E6DED2] sticky top-0 z-30 shadow-soft">
        <Link to="/" className="inline-block">
          <img src="/vedalus.png" alt="Vedalush Logo" className="h-10 w-auto object-contain" />
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#5D4E42] p-2">
          {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#FFFFFF] border-r border-[#E6DED2] py-6 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out shadow-soft ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="w-full">
          <div className="px-6 mb-12 hidden md:block">
             <Link to="/" className="inline-block mb-1">
               <img src="/vedalus.png" alt="Vedalush Logo" className="h-15 w-auto object-contain" />
             </Link>
             <p className="text-[#8E7A65] text-xs font-semibold mt-1 uppercase tracking-widest">Admin Portal</p>
          </div>
          
          <nav className="space-y-1 w-full">
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-6 py-3.5 transition-all duration-200 cursor-pointer ${activeTab === 'dashboard' ? 'bg-[#8E7A65] text-white font-semibold shadow-sm' : 'text-[#6F6A65] hover:text-[#5D4E42] hover:bg-[#F8F4EC]'}`}
            >
              <HiOutlineViewGrid size={20} /> <span>Dashboard</span>
            </button>
            <button 
              onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-6 py-3.5 transition-all duration-200 cursor-pointer ${activeTab === 'products' ? 'bg-[#8E7A65] text-white font-semibold shadow-sm' : 'text-[#6F6A65] hover:text-[#5D4E42] hover:bg-[#F8F4EC]'}`}
            >
              <HiOutlineCube size={20} /> <span>Products</span>
            </button>
            <button 
              onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-6 py-3.5 transition-all duration-200 cursor-pointer ${activeTab === 'orders' ? 'bg-[#8E7A65] text-white font-semibold shadow-sm' : 'text-[#6F6A65] hover:text-[#5D4E42] hover:bg-[#F8F4EC]'}`}
            >
              <HiOutlineShoppingCart size={20} /> <span>Orders</span>
            </button>
            <button 
              onClick={() => { setActiveTab('reviews'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-6 py-3.5 transition-all duration-200 cursor-pointer ${activeTab === 'reviews' ? 'bg-[#8E7A65] text-white font-semibold shadow-sm' : 'text-[#6F6A65] hover:text-[#5D4E42] hover:bg-[#F8F4EC]'}`}
            >
              <HiOutlineChat size={20} /> <span>Reviews</span>
            </button>
            <button 
              onClick={() => { setActiveTab('ingredients'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-6 py-3.5 transition-all duration-200 cursor-pointer ${activeTab === 'ingredients' ? 'bg-[#8E7A65] text-white font-semibold shadow-sm' : 'text-[#6F6A65] hover:text-[#5D4E42] hover:bg-[#F8F4EC]'}`}
            >
              <HiOutlineSparkles size={20} /> <span>Ingredients</span>
            </button>
            <button 
              onClick={() => { setActiveTab('subscribers'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-6 py-3.5 transition-all duration-200 cursor-pointer ${activeTab === 'subscribers' ? 'bg-[#8E7A65] text-white font-semibold shadow-sm' : 'text-[#6F6A65] hover:text-[#5D4E42] hover:bg-[#F8F4EC]'}`}
            >
              <HiOutlineMail size={20} /> <span>Subscribers</span>
            </button>
          </nav>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-6 py-3.5 text-red-600 hover:text-red-800 hover:bg-red-50 font-medium transition-colors cursor-pointer"
        >
          <HiOutlineLogout size={20} /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-73px)] md:h-screen w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <motion.div key="dashboard">{renderDashboard()}</motion.div>}
          {activeTab === 'products' && <motion.div key="products">{renderProducts()}</motion.div>}
          {activeTab === 'orders' && <motion.div key="orders">{renderOrders()}</motion.div>}
          {activeTab === 'reviews' && <motion.div key="reviews">{renderReviews()}</motion.div>}
          {activeTab === 'ingredients' && <motion.div key="ingredients">{renderIngredients()}</motion.div>}
          {activeTab === 'subscribers' && <motion.div key="subscribers">{renderSubscribers()}</motion.div>}
        </AnimatePresence>
      </main>

      {/* Full Add/Edit Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center p-4 bg-black/60 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFFFFF] border border-[#E6DED2] p-8 rounded-2xl shadow-2xl w-full max-w-4xl my-auto relative"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 text-[#8E7A65] hover:text-[#5D4E42] transition-colors cursor-pointer"
              >
                <HiX size={24} />
              </button>
              
              <h2 className="text-3xl font-serif font-bold text-[#5D4E42] mb-8">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <form onSubmit={handleProductSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#6F6A65] mb-1">Product Name *</label>
                    <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#6F6A65] mb-1">Price (₹) *</label>
                    <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#6F6A65] mb-1">Discount Price (₹)</label>
                    <input type="number" value={productForm.discountPrice} onChange={e => setProductForm({...productForm, discountPrice: e.target.value})} className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]" placeholder="Optional" />
                  </div>
                </div>

                {/* Optional International Pricing */}
                <div className="bg-[#F8F4EC] p-4 rounded-xl border border-[#E6DED2] my-4">
                  <h4 className="text-sm font-semibold text-[#5D4E42] mb-3">Optional International Pricing Overrides (Leave blank for automatic exchange rate conversion)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['USD', 'EUR', 'GBP'].map(curr => (
                      <div key={curr} className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E6DED2] shadow-soft">
                        <label className="block text-xs font-bold text-[#8E7A65] mb-2">{curr} Override ($/€/£)</label>
                        <div className="space-y-2">
                          <input 
                            type="number" 
                            placeholder="Price" 
                            value={productForm.internationalPrices?.[curr]?.price || ''}
                            onChange={e => setProductForm({
                              ...productForm,
                              internationalPrices: {
                                ...productForm.internationalPrices,
                                [curr]: { ...productForm.internationalPrices?.[curr], price: e.target.value }
                              }
                            })}
                            className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-lg px-2.5 py-1.5 text-xs text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]"
                          />
                          <input 
                            type="number" 
                            placeholder="Discount Price" 
                            value={productForm.internationalPrices?.[curr]?.discountPrice || ''}
                            onChange={e => setProductForm({
                              ...productForm,
                              internationalPrices: {
                                ...productForm.internationalPrices,
                                [curr]: { ...productForm.internationalPrices?.[curr], discountPrice: e.target.value }
                              }
                            })}
                            className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-lg px-2.5 py-1.5 text-xs text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#6F6A65] mb-1">Short Description (Sub-heading) *</label>
                  <input required type="text" value={productForm.shortDesc} onChange={e => setProductForm({...productForm, shortDesc: e.target.value})} className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#6F6A65] mb-1">Full Description *</label>
                  <textarea required rows="3" value={productForm.fullDesc} onChange={e => setProductForm({...productForm, fullDesc: e.target.value})} className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#6F6A65] mb-1">Ingredients *</label>
                    <input required type="text" value={productForm.ingredients} onChange={e => setProductForm({...productForm, ingredients: e.target.value})} className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#6F6A65] mb-1">Benefits *</label>
                    <input required type="text" value={productForm.benefits} onChange={e => setProductForm({...productForm, benefits: e.target.value})} className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#6F6A65] mb-1">Weight *</label>
                    <input required type="text" placeholder="e.g. 120g" value={productForm.weight} onChange={e => setProductForm({...productForm, weight: e.target.value})} className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#6F6A65] mb-1">Skin Type *</label>
                    <input required type="text" placeholder="e.g. Oily / Acne Prone" value={productForm.skinType} onChange={e => setProductForm({...productForm, skinType: e.target.value})} className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]" />
                  </div>
                </div>

                <div className="p-6 border border-[#E6DED2] rounded-xl bg-[#FDFBF7]">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-semibold text-[#5D4E42]">Product Images (Cloudinary URLs) *</label>
                    <button type="button" onClick={addImageField} className="text-xs flex items-center space-x-1 bg-[#B88A5A] hover:bg-[#9F7348] px-3.5 py-1.5 rounded-lg text-white font-semibold shadow-soft cursor-pointer">
                      <HiPlus /> <span>Add Image</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {productForm.images.map((url, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-3 md:items-center">
                        <div className="flex space-x-3 items-center w-full md:w-auto">
                          {url && url !== 'Uploading...' && url.startsWith('http') && (
                             <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#E6DED2]">
                               <img src={url} alt="Preview" className="w-full h-full object-cover" />
                             </div>
                          )}
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={e => handleFileUpload(index, e.target.files[0])}
                            className="w-full md:w-auto bg-[#F8F4EC] border border-[#E6DED2] rounded-lg px-2 py-1 text-[#5D4E42] text-sm"
                          />
                        </div>
                        <div className="flex space-x-3 w-full">
                          <input 
                            type="text" 
                            required={index === 0}
                            placeholder="Or paste URL..." 
                            value={url} 
                            onChange={e => handleImageChange(index, e.target.value)} 
                            className={`flex-1 w-full bg-[#FFFFFF] border border-[#E6DED2] rounded-xl px-4 py-2 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A] ${url === 'Uploading...' ? 'text-amber-600 animate-pulse' : ''}`} 
                            readOnly={url === 'Uploading...'}
                          />
                          {productForm.images.length > 1 && (
                            <button type="button" onClick={() => removeImageField(index)} className="px-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 py-2 shrink-0 cursor-pointer">
                              <HiTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#6F6A65] mb-1">Amazon Link (Optional)</label>
                    <input type="text" value={productForm.amazonLink} onChange={e => setProductForm({...productForm, amazonLink: e.target.value})} className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#6F6A65] mb-1">Flipkart Link (Optional)</label>
                    <input type="text" value={productForm.flipkartLink} onChange={e => setProductForm({...productForm, flipkartLink: e.target.value})} className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-2.5 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A]" />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 mt-8 border-t border-[#E6DED2]">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-[#8E7A65] hover:text-[#5D4E42] font-semibold transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-[#B88A5A] hover:bg-[#9F7348] text-white rounded-full transition-all duration-250 font-semibold shadow-soft cursor-pointer">
                    {editingProduct ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-center p-4 bg-black/60 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFFFFF] border border-[#E6DED2] p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative my-auto"
            >
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 text-[#8E7A65] hover:text-[#5D4E42] transition-colors cursor-pointer"
              >
                <HiX size={24} />
              </button>
              
              <h2 className="text-2xl font-serif font-bold text-[#5D4E42] mb-6 border-b border-[#E6DED2] pb-4">
                Order Details <span className="text-sm font-mono font-bold text-[#8E7A65] ml-2">#{selectedOrder._id}</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#5D4E42]">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-[#9D948B] block font-medium">Name</span> <span className="text-[#5D4E42] font-semibold">{selectedOrder.name}</span></p>
                    <p><span className="text-[#9D948B] block font-medium">Email</span> <span className="text-[#5D4E42] font-semibold">{selectedOrder.email}</span></p>
                    <p>
                      <span className="text-[#9D948B] block font-medium">Phone</span>
                      <span className="flex items-center gap-2">
                        <span className="text-[#5D4E42] font-semibold">{selectedOrder.phone}</span>
                        {selectedOrder.phone && (
                          <a 
                            href={`https://wa.me/${selectedOrder.phone.replace(/\D/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="Message on WhatsApp"
                            className="text-green-600 hover:text-green-500 transition-colors"
                          >
                            <FaWhatsapp size={16} />
                          </a>
                        )}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#5D4E42]">Shipping Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-[#9D948B] block font-medium">Country</span> <span className="text-[#5D4E42] font-semibold">{selectedOrder.country}</span></p>
                    <p><span className="text-[#9D948B] block font-medium">Full Address</span> <span className="text-[#5D4E42] font-semibold">{selectedOrder.address}</span></p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="space-y-4 md:col-span-2 border-t border-[#E6DED2] pt-6">
                  <h3 className="text-lg font-bold text-[#5D4E42]">Order Information</h3>
                  <div className="bg-[#F8F4EC] rounded-xl p-4 border border-[#E6DED2] space-y-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      <div className="space-y-2 pb-3 border-b border-[#E6DED2]/60">
                        <div className="text-xs text-[#8E7A65] font-bold tracking-wider uppercase mb-1">Requested Products ({selectedOrder.items.length}):</div>
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-[#FFFFFF] px-3 py-2 rounded-lg text-sm border border-[#E6DED2]/40 shadow-soft">
                            <span className="text-[#5D4E42] font-bold">• {item.product}</span>
                            <span className="text-white font-mono font-bold bg-[#8E7A65] px-2.5 py-0.5 rounded-full text-xs">Qty: {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-between items-center pb-3 border-b border-[#E6DED2]/60">
                        <span className="text-[#5D4E42] font-bold">{selectedOrder.product}</span>
                        <span className="text-[#5D4E42] font-bold">Qty: {selectedOrder.quantity}</span>
                      </div>
                    )}
                    {selectedOrder.message && (
                      <div className="pt-2">
                        <span className="text-[#8E7A65] text-xs font-bold block mb-1">Additional Message / Request:</span>
                        <p className="text-sm text-[#6F6A65] italic bg-[#FFFFFF] p-3 rounded-lg border border-[#E6DED2]/40">"{selectedOrder.message}"</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-[#8E7A65] font-medium text-sm">Submitted on: {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    <CustomStatusDropdown 
                      value={selectedOrder.status}
                      onChange={(newStatus) => {
                        handleStatusChange(selectedOrder._id, newStatus);
                        setSelectedOrder({...selectedOrder, status: newStatus});
                      }}
                      type="modal"
                      options={[
                        { value: 'pending', label: 'PENDING' },
                        { value: 'contacted', label: 'CONTACTED' },
                        { value: 'completed', label: 'COMPLETED' }
                      ]}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Ingredient Modal */}
      <AnimatePresence>
        {isIngredientModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center p-4 bg-black/60 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FFFFFF] border border-[#E6DED2] p-8 rounded-2xl shadow-2xl w-full max-w-lg my-auto relative"
            >
              <button 
                onClick={() => setIsIngredientModalOpen(false)}
                className="absolute top-6 right-6 text-[#8E7A65] hover:text-[#5D4E42] transition-colors cursor-pointer"
              >
                <HiX size={24} />
              </button>
              <h3 className="text-2xl font-serif font-bold text-[#5D4E42] mb-6">
                {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
              </h3>
              
              <form onSubmit={handleSaveIngredient} className="space-y-5">
                <div>
                  <label className="block text-sm text-[#6F6A65] mb-1.5 font-semibold">Ingredient Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Aloe Vera" 
                    value={ingredientForm.name} 
                    onChange={e => setIngredientForm({ ...ingredientForm, name: e.target.value })} 
                    className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-3 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A] transition-colors text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#6F6A65] mb-1.5 font-semibold">Description</label>
                  <textarea 
                    required 
                    rows={3} 
                    placeholder="e.g. Soothes and hydrates." 
                    value={ingredientForm.desc} 
                    onChange={e => setIngredientForm({ ...ingredientForm, desc: e.target.value })} 
                    className="w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-3 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A] transition-colors text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#6F6A65] mb-1.5 font-semibold">Image (Cloudinary Upload / URL)</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        required 
                        placeholder="Image URL or upload via button ->" 
                        value={ingredientForm.image} 
                        onChange={e => setIngredientForm({ ...ingredientForm, image: e.target.value })} 
                        className={`flex-1 w-full bg-[#F8F4EC] border border-[#E6DED2] rounded-xl px-4 py-3 text-[#5D4E42] focus:outline-none focus:border-[#B88A5A] text-sm ${ingredientForm.image === 'Uploading...' ? 'text-amber-600 animate-pulse' : ''}`} 
                        readOnly={ingredientForm.image === 'Uploading...'} 
                      />
                      <label className="bg-[#B88A5A] hover:bg-[#9F7348] text-white px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-colors whitespace-nowrap shadow-soft">
                        <span>Upload</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={e => handleIngredientImageUpload(e.target.files[0])} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                    {ingredientForm.image && ingredientForm.image !== 'Uploading...' && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#E6DED2] bg-[#F8F4EC] relative group shadow-soft">
                        <img src={ingredientForm.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3 border-t border-[#E6DED2]">
                  <button 
                    type="button" 
                    onClick={() => setIsIngredientModalOpen(false)} 
                    className="px-5 py-2.5 text-[#8E7A65] hover:text-[#5D4E42] transition-colors text-sm font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={ingredientForm.image === 'Uploading...'}
                    className="bg-[#B88A5A] hover:bg-[#9F7348] disabled:opacity-50 text-white px-6 py-2.5 rounded-full transition-all duration-250 shadow-soft text-sm font-semibold cursor-pointer"
                  >
                    {editingIngredient ? 'Update Ingredient' : 'Create Ingredient'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
