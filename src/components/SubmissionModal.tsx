/**
 * Entity Submission Modal Component
 * Allows users to submit their entities to join the DAO buyback movement
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIMATION_DURATIONS } from '../constants';

// Step definitions for progressive form
const FORM_STEPS = [
  { id: 1, title: 'Protocol Info', description: 'Basic protocol details' },
  { id: 2, title: 'Contact & Links', description: 'How to reach you and find more info' },
  { id: 3, title: 'Treasury Details', description: 'Buyback and wallet information' },
  { id: 4, title: 'Review & Submit', description: 'Confirm your submission' }
] as const;

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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.submitterContact.trim()) {
      newErrors.submitterContact = 'Contact information is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const nextStep = useCallback(() => {
    if (currentStep < FORM_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const validateCurrentStep = useCallback((): boolean => {
    const newErrors: Partial<SubmissionData> = {};

    if (currentStep === 1) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Protocol name is required';
      }
    } else if (currentStep === 2) {
      if (!formData.submitterContact.trim()) {
        newErrors.submitterContact = 'Contact information is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, currentStep]);

  const handleNext = useCallback(() => {
    if (validateCurrentStep()) {
      nextStep();
    }
  }, [validateCurrentStep, nextStep]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === FORM_STEPS.length && validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        // Reset form
        setFormData({
          companyName: '',
          tickerSymbol: '',
          websiteUrl: '',
          twitter: '',
          submitterContact: '',
          briefDescription: '',
          walletAddresses: ''
        });
        setCurrentStep(1);
        onClose();
      } catch (error) {
        console.error('Submission failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep < FORM_STEPS.length) {
      handleNext();
    }
  }, [formData, validateForm, onSubmit, onClose, currentStep, handleNext]);

  // Render form content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono"
                  placeholder="TOKEN"
                  style={{
                    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Website & Twitter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-white mb-3 font-mono">
                  Website URL
                  <span className="text-xs text-gray-400 font-normal ml-2">(optional)</span>
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono"
                  placeholder="https://protocol.com"
                  style={{
                    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-3 font-mono">
                  Twitter Handle
                  <span className="text-xs text-gray-400 font-normal ml-2">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono"
                  placeholder="@protocol"
                  style={{
                    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-bold text-white mb-3 font-mono">
                Your Contact Info *
                <span className="text-xs text-gray-400 font-normal ml-2">(Telegram, Email, Discord)</span>
              </label>
              <input
                type="text"
                value={formData.submitterContact}
                onChange={(e) => handleInputChange('submitterContact', e.target.value)}
                className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono ${
                  errors.submitterContact ? 'border-red-500 focus:ring-red-400 focus:border-red-400' : 'border-gray-800 hover:border-gray-700'
                }`}
                placeholder="@username or email@domain.com"
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
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Brief Description */}
            <div>
              <label className="block text-sm font-bold text-white mb-3 font-mono">
                Protocol Description
                <span className="text-xs text-gray-400 font-normal ml-2">(optional, will be posted on X)</span>
              </label>
              <textarea
                value={formData.briefDescription}
                onChange={(e) => handleInputChange('briefDescription', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono"
                placeholder="Brief description of your protocol and buyback strategy..."
                style={{
                  boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}
              />
            </div>

            {/* Wallet Addresses */}
            <div>
              <label className="block text-sm font-bold text-white mb-3 font-mono">
                Treasury Wallet Addresses
                <span className="text-xs text-gray-400 font-normal ml-2">(optional, kept private)</span>
              </label>
              <textarea
                value={formData.walletAddresses}
                onChange={(e) => handleInputChange('walletAddresses', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:bg-[#151515] transition-all font-mono"
                placeholder="0xfoo,0xbar (comma-separated)"
                style={{
                  boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05)'
                }}
              />
              <p className="text-sm text-gray-400 mt-2 font-mono">
                🔒 Wallet addresses are kept strictly confidential and never shared publicly
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 font-mono">Review Your Submission</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 font-mono">Protocol Name</label>
                    <p className="text-white font-mono">{formData.companyName || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-mono">Token Symbol</label>
                    <p className="text-white font-mono">{formData.tickerSymbol || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 font-mono">Website</label>
                    <p className="text-white font-mono">{formData.websiteUrl || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-mono">Twitter</label>
                    <p className="text-white font-mono">{formData.twitter || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 font-mono">Contact</label>
                  <p className="text-white font-mono">{formData.submitterContact || 'Not provided'}</p>
                </div>
                
                {formData.briefDescription && (
                  <div>
                    <label className="text-sm text-gray-400 font-mono">Description</label>
                    <p className="text-white font-mono text-sm">{formData.briefDescription}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-green-300 font-mono text-sm font-medium">What happens next?</p>
                  <p className="text-green-200/80 text-xs mt-1 font-mono">
                    Our team will review your submission within 24-48 hours. You'll receive an update via your provided contact method.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
                {/* Enhanced Header */}
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
                      <h2 className="text-3xl font-bold text-white mb-3 font-mono">Add Your Protocol</h2>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Join the <span className="text-green-400 font-medium">DAO buyback movement</span> and help grow the ecosystem.
                      </p>
                      
                      {/* Step Progress Indicator */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-mono text-gray-400">
                            Step {currentStep} of {FORM_STEPS.length}
                          </div>
                          <div className="text-sm font-mono text-green-400">
                            {FORM_STEPS[currentStep - 1]?.title}
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          {FORM_STEPS.map((step) => (
                            <div
                              key={step.id}
                              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                step.id <= currentStep
                                  ? 'bg-green-400'
                                  : 'bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2 font-mono">
                          {FORM_STEPS[currentStep - 1]?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={onClose}
                    className="text-gray-500 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-all flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Progressive Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Dynamic Form Content */}
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>

                  {/* Enhanced Submit Button Section */}
                  <div className="pt-8 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400 font-mono">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>All data is kept confidential</span>
                        </div>
                      </div>
                      
                      <motion.button
                          type="submit"
                          className="px-8 py-3 font-mono font-bold rounded-lg transition-all shadow-lg relative overflow-hidden"
                          style={{ 
                            background: `linear-gradient(135deg, #00ff87, #00e67a)`,
                            color: '#000000',
                            boxShadow: `0 10px 25px -5px rgba(0, 255, 135, 0.3), 0 0 0 1px rgba(0, 255, 135, 0.1)`
                          }}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span>Submit Protocol</span>
                          </div>
                          
                          {/* Animated glow effect */}
                          <div 
                            className="absolute inset-0 rounded-lg opacity-20 animate-pulse"
                            style={{ 
                              background: `radial-gradient(circle at center, #00ff87, transparent)` 
                            }} 
                          />
                        </motion.button>
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