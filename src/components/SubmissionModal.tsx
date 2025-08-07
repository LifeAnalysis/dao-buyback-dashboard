/**
 * Entity Submission Modal Component
 * Allows users to submit their entities to join the DAO buyback movement
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIMATION_DURATIONS } from '../constants';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubmissionData) => void;
}

interface SubmissionData {
  companyName: string;
  tickerSymbol: string;
  category: string;
  websiteUrl: string;
  twitter: string;
  currentEthReserve: string;
  submitterContact: string;
  briefDescription: string;
  walletAddresses: string;
}

const categories = [
  'DeFi Protocol',
  'Layer 1/Layer 2',
  'Infrastructure',
  'DAO',
  'Gaming',
  'NFT',
  'RWA',
  'AI/ML',
  'Other'
];



export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<SubmissionData>({
    companyName: '',
    tickerSymbol: '',
    category: '',
    websiteUrl: '',
    twitter: '',
    currentEthReserve: '',
    submitterContact: '',
    briefDescription: '',
    walletAddresses: ''
  });

  const [errors, setErrors] = useState<Partial<SubmissionData>>({});

  const handleInputChange = useCallback((
    field: keyof SubmissionData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<SubmissionData> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.currentEthReserve.trim()) {
      newErrors.currentEthReserve = 'Current ETH reserve is required';
    }

    if (!formData.submitterContact.trim()) {
      newErrors.submitterContact = 'Contact information is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        companyName: '',
        tickerSymbol: '',
        category: '',
        websiteUrl: '',
        twitter: '',
        currentEthReserve: '',
        submitterContact: '',
        briefDescription: '',
        walletAddresses: ''
      });
      onClose();
    }
  }, [formData, validateForm, onSubmit, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION_DURATIONS.FAST }}
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              className="bg-[#0a0a0a] border border-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 255, 135, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: ANIMATION_DURATIONS.NORMAL }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 font-mono">Submit Your Entity</h2>
                    <p className="text-gray-400">Join the DAO buyback movement by submitting your entity.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Name & Ticker */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-[#222] transition-all ${
                          errors.companyName ? 'border-red-500' : 'border-gray-700'
                        }`}
                        placeholder="Enter company name"
                      />
                      {errors.companyName && (
                        <p className="text-red-400 text-xs mt-1">{errors.companyName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                        Ticker Symbol
                      </label>
                      <input
                        type="text"
                        value={formData.tickerSymbol}
                        onChange={(e) => handleInputChange('tickerSymbol', e.target.value)}
                        className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-[#222] transition-all"
                        placeholder="BTC, ETH, etc."
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-[#222] transition-all ${
                        errors.category ? 'border-red-500' : 'border-gray-700'
                      }`}
                    >
                      <option value="" className="bg-[#1a1a1a] text-gray-400">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category} className="bg-[#1a1a1a] text-white">
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-400 text-xs mt-1">{errors.category}</p>
                    )}
                  </div>

                  {/* Website & Twitter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-[#222] transition-all"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                        Twitter
                      </label>
                      <input
                        type="text"
                        value={formData.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                        className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-[#222] transition-all"
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  {/* ETH Reserve & Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                        Current ETH Reserve *
                      </label>
                      <input
                        type="text"
                        value={formData.currentEthReserve}
                        onChange={(e) => handleInputChange('currentEthReserve', e.target.value)}
                        className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-[#222] transition-all ${
                          errors.currentEthReserve ? 'border-red-500' : 'border-gray-700'
                        }`}
                        placeholder="Minimum 100 ETH"
                      />
                      {errors.currentEthReserve && (
                        <p className="text-red-400 text-xs mt-1">{errors.currentEthReserve}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                        Submitter's Contact *
                      </label>
                      <input
                        type="text"
                        value={formData.submitterContact}
                        onChange={(e) => handleInputChange('submitterContact', e.target.value)}
                        className={`w-full px-3 py-2 bg-[#1a1a1a] border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-[#222] transition-all ${
                          errors.submitterContact ? 'border-red-500' : 'border-gray-700'
                        }`}
                        placeholder="Telegram/Email"
                      />
                      {errors.submitterContact && (
                        <p className="text-red-400 text-xs mt-1">{errors.submitterContact}</p>
                      )}
                    </div>
                  </div>

                  {/* Brief Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                      Brief blurb (Posted on X)
                    </label>
                    <textarea
                      value={formData.briefDescription}
                      onChange={(e) => handleInputChange('briefDescription', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-[#222] transition-all"
                      placeholder="Enter a brief description or announcement..."
                    />
                  </div>

                  {/* Wallet Addresses */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                      Wallet Addresses
                    </label>
                    <textarea
                      value={formData.walletAddresses}
                      onChange={(e) => handleInputChange('walletAddresses', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-[#222] transition-all"
                      placeholder="0xfoo,0xbar"
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Comma-separated list of addresses (kept private, never shared)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-400 bg-[#1a1a1a] hover:bg-[#2a2a2a] hover:text-white border border-gray-700 rounded-lg transition-colors font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium font-mono shadow-lg hover:shadow-green-500/25"
                    >
                      Submit Entity
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};