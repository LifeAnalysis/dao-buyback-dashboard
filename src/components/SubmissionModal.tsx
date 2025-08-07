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

const networksTracked = [
  'Ethereum', 'Base', 'Optimism', 'Arbitrum', 'Arbitrum Nova',
  'Gnosis', 'Linea', 'Gnosis', 'Abstract'
];

const assetsTracked = [
  'ETH', 'stETH', 'wstETH', 'rETH', 'WETH', 'oETH', 'ankrETH', 'ETHx',
  'rsETH', 'eETH', 'weETH', 'cmETH', 'mETH', 'spWETH', 'cWETHv3', 'frxETH',
  'sfrxETH', 'fwETH', 'and Aave derivatives (aETH, aWETH, awstETH,',
  'aweETH, arETH, aosETH, aLTH, aLidoWETH)'
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
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION_DURATIONS.FAST }}
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Your Entity</h2>
                    <p className="text-gray-600">Join the SER movement by submitting your entity.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Name & Ticker */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.companyName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter company name"
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ticker Symbol
                      </label>
                      <input
                        type="text"
                        value={formData.tickerSymbol}
                        onChange={(e) => handleInputChange('tickerSymbol', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="BTC, ETH, etc."
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                    )}
                  </div>

                  {/* Website & Twitter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter
                      </label>
                      <input
                        type="text"
                        value={formData.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  {/* ETH Reserve & Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current ETH Reserve *
                      </label>
                      <input
                        type="text"
                        value={formData.currentEthReserve}
                        onChange={(e) => handleInputChange('currentEthReserve', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.currentEthReserve ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Minimum 100 ETH"
                      />
                      {errors.currentEthReserve && (
                        <p className="text-red-500 text-xs mt-1">{errors.currentEthReserve}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Submitter's Contact *
                      </label>
                      <input
                        type="text"
                        value={formData.submitterContact}
                        onChange={(e) => handleInputChange('submitterContact', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.submitterContact ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Telegram/Email"
                      />
                      {errors.submitterContact && (
                        <p className="text-red-500 text-xs mt-1">{errors.submitterContact}</p>
                      )}
                    </div>
                  </div>

                  {/* Brief Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brief blurb (Posted on X)
                    </label>
                    <textarea
                      value={formData.briefDescription}
                      onChange={(e) => handleInputChange('briefDescription', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter a brief description or announcement..."
                    />
                  </div>

                  {/* Wallet Addresses */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wallet Addresses
                    </label>
                    <textarea
                      value={formData.walletAddresses}
                      onChange={(e) => handleInputChange('walletAddresses', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="0xfoo,0xbar"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Comma-separated list of addresses (kept private, never shared)
                    </p>
                  </div>

                  {/* Tracking Information */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className="text-green-600 text-lg">✓</span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-green-800 mb-2">
                          We track ETH assets across:
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-green-700 font-medium">Networks:</p>
                            <p className="text-xs text-green-600">
                              {networksTracked.join(', ')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-green-700 font-medium">Assets:</p>
                            <p className="text-xs text-green-600">
                              {assetsTracked.join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
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