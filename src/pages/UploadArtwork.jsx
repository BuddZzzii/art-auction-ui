import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UploadArtwork = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // 1. Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    initialPrice: '',
    categoryId: '1', // Default category
    auctionStartTime: '',
    auctionEndTime: ''
  });
  const [imageFile, setImageFile] = useState(null);

  // 2. Handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // ⚡ 3. The Core Upload Logic (Replacing Swagger)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // We MUST use FormData to send files to the C# [FromForm] endpoint
      const payload = new FormData();
      
      payload.append('Title', formData.title);
      payload.append('Description', formData.description);
      payload.append('InitialPrice', formData.initialPrice);
      payload.append('CategoryId', formData.categoryId);
      
      // Convert local datetime strings to proper ISO formats for C#
      payload.append('AuctionStartTime', new Date(formData.auctionStartTime).toISOString());
      payload.append('AuctionEndTime', new Date(formData.auctionEndTime).toISOString());

      // Append the actual physical image file
      if (imageFile) {
        payload.append('images', imageFile); 
      }

      // Fire the request! Axios automatically sets the multipart boundary headers when given FormData
      await api.post('/artworks', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus({ type: 'success', message: 'Artwork successfully submitted! It is now pending Admin approval.' });
      
      // Send them to the gallery or dashboard after 2 seconds
      setTimeout(() => {
        navigate('/browse'); // Or wherever your artist dashboard is
      }, 2000);

    } catch (error) {
      console.error('Upload Error:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to upload artwork. Check console for details.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-slate-900 py-6 px-8 text-white">
          <h1 className="text-2xl font-extrabold">Upload New Artwork</h1>
          <p className="text-slate-400 text-sm mt-1">Submit your masterpiece to the auction house.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Status Messages */}
          {status.message && (
            <div className={`p-4 rounded-lg font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {status.type === 'success' ? '✅ ' : '⚠️ '}
              {status.message}
            </div>
          )}

          {/* Title & Price Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Artwork Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                placeholder="e.g. Midnight Mirage"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Starting Bid ($)</label>
              <input
                type="number"
                name="initialPrice"
                required
                min="1"
                value={formData.initialPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                placeholder="500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="Tell the story behind your artwork..."
            ></textarea>
          </div>

          {/* Timeframe Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Auction Start Time</label>
              <input
                type="datetime-local"
                name="auctionStartTime"
                required
                value={formData.auctionStartTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Auction End Time</label>
              <input
                type="datetime-local"
                name="auctionEndTime"
                required
                value={formData.auctionEndTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Category & Image Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Category ID</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
              >
                <option value="1">Digital Art</option>
                <option value="2">Physical Painting</option>
                <option value="3">Photography</option>
              </select>
            </div>
            
            {/* THE FILE UPLOAD */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Artwork Image</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-md ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'}`}
            >
              {isLoading ? 'Uploading to Database...' : 'Submit to Auction'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default UploadArtwork;