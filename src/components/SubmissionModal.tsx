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
  websiteUrl: string;
  twitter: string;
  submitterContact: string;
  briefDescription: string;
  walletAddresses: string;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<SubmissionData>({
    companyName: '',
    tickerSymbol: '',
    websiteUrl: '',
    twitter: '',
    submitterContact: '',
    briefDescription: '',
    walletAddresses: ''
  });

  const [errors, setErrors] = useState<Partial<SubmissionData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  const resetForm = useCallback(() => {
    setFormData({
      companyName: '',
      tickerSymbol: '',
      websiteUrl: '',
      twitter: '',
      submitterContact: '',
      briefDescription: '',
      walletAddresses: ''
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  // Enhanced close handler
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

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
      newErrors.companyName = 'Protocol name is required';
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = 'Protocol name must be at least 2 characters';
    }

    if (formData.tickerSymbol && formData.tickerSymbol.length > 10) {
      newErrors.tickerSymbol = 'Token symbol should be 10 characters or less';
    }

    if (!formData.submitterContact.trim()) {
      newErrors.submitterContact = 'Contact information is required';
    }

    if (formData.websiteUrl && !formData.websiteUrl.match(/^https?:\/\/.+/)) {
      newErrors.websiteUrl = 'Please enter a valid website URL (starting with http:// or https://)';
    }

    if (formData.twitter && !formData.twitter.match(/^@?[\w]+$/)) {
      newErrors.twitter = 'Please enter a valid Twitter handle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        resetForm();
        handleClose();
      } catch (error) {
        console.error('Submission failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [formData, validateForm, onSubmit, handleClose, resetForm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: ANIMATION_DURATIONS.NORMAL }}
            onClick={handleClose}
          >
            {/* Modal Content */}
            <motion.div
              className="w-full max-w-2xl bg-[#0a0a0a] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 255, 135, 0.1), 0 0 0 1px rgba(0, 255, 135, 0.05)'
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: ANIMATION_DURATIONS.NORMAL }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-start gap-4">
                    {/* Treasury icon */}
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden flex-shrink-0 mt-1" 
                      style={{ 
                        background: `linear-gradient(135deg, #00ff87, #00e67a)` 
                      }}
                    >
                      <svg 
                        width="32" 
                        height="32" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="text-black"
                      >
                        <rect x="2" y="8" width="20" height="12" rx="1" fill="currentColor" opacity="0.9"/>
                        <rect x="4" y="10" width="2" height="6" fill="white" opacity="0.8"/>
                        <rect x="7" y="10" width="2" height="6" fill="white" opacity="0.8"/>
                        <rect x="10" y="10" width="2" height="6" fill="white" opacity="0.8"/>
                        <rect x="13" y="10" width="2" height="6" fill="white" opacity="0.8"/>
                        <rect x="16" y="10" width="2" height="6" fill="white" opacity="0.8"/>
                        <path d="M1 8L12 2L23 8H1Z" fill="currentColor"/>
                        <circle cx="12" cy="14" r="2" fill="white" opacity="0.9"/>
                        <circle cx="12" cy="14" r="1" fill="currentColor" opacity="0.3"/>
                      </svg>
                    </div>
                    
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-3 font-mono">Add Your DAO</h2>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-all flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Protocol Info Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white font-mono border-b border-gray-800 pb-2">
                      Protocol Information
                    </h3>
                    
                    {/* Protocol Name & Token Symbol */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-white mb-3 font-mono">
                          Protocol Name *
                          <span className="text-xs text-gray-400 font-normal ml-2">(e.g., Aave, Uniswap)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono ${
                            errors.companyName ? 'border-red-500 focus:ring-red-400 focus:border-red-400' : 'border-gray-800 hover:border-gray-700'
                          }`}
                          placeholder="Enter protocol name"
                          style={{
                            boxShadow: errors.companyName 
                              ? '0 0 0 1px rgba(239, 68, 68, 0.1)' 
                              : '0 0 0 1px rgba(255, 255, 255, 0.05)'
                          }}
                        />
                        {errors.companyName && (
                          <p className="text-red-400 text-xs mt-1">{errors.companyName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-white mb-3 font-mono">
                          Token Symbol
                          <span className="text-xs text-gray-400 font-normal ml-2">(e.g., AAVE, UNI)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.tickerSymbol}
                          onChange={(e) => handleInputChange('tickerSymbol', e.target.value)}
                          className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono ${
                            errors.tickerSymbol ? 'border-red-500 focus:ring-red-400 focus:border-red-400' : 'border-gray-800 hover:border-gray-700'
                          }`}
                          placeholder="TOKEN"
                          style={{
                            boxShadow: errors.tickerSymbol 
                              ? '0 0 0 1px rgba(239, 68, 68, 0.1)' 
                              : '0 0 0 1px rgba(255, 255, 255, 0.05)'
                          }}
                        />
                        {errors.tickerSymbol && (
                          <p className="text-red-400 text-xs mt-1">{errors.tickerSymbol}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact & Links Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white font-mono border-b border-gray-800 pb-2">
                      Contact & Links
                    </h3>
                    
                    {/* Website & Twitter */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-white mb-3 font-mono">
                          Website URL
                          <span className="text-xs text-gray-400 font-normal ml-2">(https://...)</span>
                        </label>
                        <input
                          type="url"
                          value={formData.websiteUrl}
                          onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                          className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono ${
                            errors.websiteUrl ? 'border-red-500 focus:ring-red-400 focus:border-red-400' : 'border-gray-800 hover:border-gray-700'
                          }`}
                          placeholder="https://protocol.com"
                          style={{
                            boxShadow: errors.websiteUrl 
                              ? '0 0 0 1px rgba(239, 68, 68, 0.1)' 
                              : '0 0 0 1px rgba(255, 255, 255, 0.05)'
                          }}
                        />
                        {errors.websiteUrl && (
                          <p className="text-red-400 text-xs mt-1">{errors.websiteUrl}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-white mb-3 font-mono">
                          Twitter Handle
                          <span className="text-xs text-gray-400 font-normal ml-2">(@username)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.twitter}
                          onChange={(e) => handleInputChange('twitter', e.target.value)}
                          className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono ${
                            errors.twitter ? 'border-red-500 focus:ring-red-400 focus:border-red-400' : 'border-gray-800 hover:border-gray-700'
                          }`}
                          placeholder="@protocol"
                          style={{
                            boxShadow: errors.twitter 
                              ? '0 0 0 1px rgba(239, 68, 68, 0.1)' 
                              : '0 0 0 1px rgba(255, 255, 255, 0.05)'
                          }}
                        />
                        {errors.twitter && (
                          <p className="text-red-400 text-xs mt-1">{errors.twitter}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-3 font-mono">
                        Contact Information *
                        <span className="text-xs text-gray-400 font-normal ml-2">(Email, Discord, Telegram)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.submitterContact}
                        onChange={(e) => handleInputChange('submitterContact', e.target.value)}
                        className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono ${
                          errors.submitterContact ? 'border-red-500 focus:ring-red-400 focus:border-red-400' : 'border-gray-800 hover:border-gray-700'
                        }`}
                        placeholder="team@protocol.com or @username"
                        style={{
                          boxShadow: errors.submitterContact 
                            ? '0 0 0 1px rgba(239, 68, 68, 0.1)' 
                            : '0 0 0 1px rgba(255, 255, 255, 0.05)'
                        }}
                      />
                      {errors.submitterContact && (
                        <p className="text-red-400 text-xs mt-1">{errors.submitterContact}</p>
                      )}
                    </div>
                  </div>

                  {/* Treasury Details Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white font-mono border-b border-gray-800 pb-2">
                      Treasury Details
                    </h3>
                    
                    {/* Brief Description */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-3 font-mono">
                        Brief Description
                        <span className="text-xs text-gray-400 font-normal ml-2">(What does your protocol do?)</span>
                      </label>
                      <textarea
                        value={formData.briefDescription}
                        onChange={(e) => handleInputChange('briefDescription', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono resize-none ${
                          errors.briefDescription ? 'border-red-500 focus:ring-red-400 focus:border-red-400' : 'border-gray-800 hover:border-gray-700'
                        }`}
                        placeholder="Brief description of your protocol and buyback mechanism..."
                        style={{
                          boxShadow: errors.briefDescription 
                            ? '0 0 0 1px rgba(239, 68, 68, 0.1)' 
                            : '0 0 0 1px rgba(255, 255, 255, 0.05)'
                        }}
                      />
                      {errors.briefDescription && (
                        <p className="text-red-400 text-xs mt-1">{errors.briefDescription}</p>
                      )}
                    </div>

                    {/* Wallet Addresses */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-3 font-mono">
                        Treasury/Buyback Wallet Addresses
                        <span className="text-xs text-gray-400 font-normal ml-2">(One per line)</span>
                      </label>
                      <textarea
                        value={formData.walletAddresses}
                        onChange={(e) => handleInputChange('walletAddresses', e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono resize-none ${
                          errors.walletAddresses ? 'border-red-500 focus:ring-red-400 focus:border-red-400' : 'border-gray-800 hover:border-gray-700'
                        }`}
                        placeholder="0x123...abc&#10;0x456...def"
                        style={{
                          boxShadow: errors.walletAddresses 
                            ? '0 0 0 1px rgba(239, 68, 68, 0.1)' 
                            : '0 0 0 1px rgba(255, 255, 255, 0.05)'
                        }}
                      />
                      {errors.walletAddresses && (
                        <p className="text-red-400 text-xs mt-1">{errors.walletAddresses}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button Section */}
                  <div className="pt-8 border-t border-gray-800">
                    <div className="flex items-center justify-end">
                      
                      <div className="flex gap-3">
                        {/* Cancel Button */}
                        <motion.button
                          type="button"
                          onClick={handleClose}
                          className="px-5 py-3 text-gray-400 bg-[#1a1a1a] hover:bg-[#2a2a2a] hover:text-white border border-gray-700 rounded-lg transition-all font-mono"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                        
                        {/* Submit Button */}
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-8 py-3 font-mono font-bold rounded-lg transition-all shadow-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ 
                            background: `linear-gradient(135deg, #00ff87, #00e67a)`,
                            color: '#000000',
                            boxShadow: `0 10px 25px -5px rgba(0, 255, 135, 0.3), 0 0 0 1px rgba(0, 255, 135, 0.1)`
                          }}
                          whileHover={!isSubmitting ? { scale: 1.02, y: -1 } : {}}
                          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        >
                          <div className="flex items-center gap-2">
                            {isSubmitting ? (
                              <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <span>Submit Protocol</span>
                              </>
                            )}
                          </div>
                          
                          {/* Animated glow effect */}
                          {!isSubmitting && (
                            <div 
                              className="absolute inset-0 rounded-lg opacity-20 animate-pulse"
                              style={{ 
                                background: `radial-gradient(circle at center, #00ff87, transparent)` 
                              }} 
                            />
                          )}
                        </motion.button>
                      </div>
                    </div>
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