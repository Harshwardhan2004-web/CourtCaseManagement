import React, { useState } from 'react';
import { ArrowLeft, FileText, User, Mail, Phone, Save, Hash, Scale } from 'lucide-react';
import { UserData, CaseData } from '../App';

interface CaseFormProps {
  currentUser: UserData;
  onSubmit: (caseData: Omit<CaseData, 'id' | 'status' | 'submittedAt'>) => void;
  onBack: () => void;
  onLogout: () => void;
}

const CaseForm: React.FC<CaseFormProps> = ({ currentUser, onSubmit, onBack, onLogout }) => {
  // Generate unique case number
  const generateCaseNumber = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `CASE-${year}-${timestamp}`;
  };

  const [formData, setFormData] = useState({
    caseNumber: generateCaseNumber(),
    title: '',
    description: '',
    caseType: '',
    section: '',
    clientName: currentUser.name,
    clientEmail: currentUser.email,
    clientPhone: '',
    nextDate: '', // <-- new field
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const caseTypes = [
    'Criminal',
    'Civil'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Case title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Case description is required';
    }

    if (!formData.caseType) {
      newErrors.caseType = 'Case type is required';
    }

    if (!formData.section.trim()) {
      newErrors.section = 'Legal section is required';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Email is invalid';
    }

    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Phone number is required';
    } else if (!/^\+91\d{10}$/.test(formData.clientPhone)) {
      newErrors.clientPhone = 'Phone format should be +911234567890';
    }

    if (!formData.nextDate) {
      newErrors.nextDate = 'Next date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'clientEmail' || field === 'email') {
      value = value.toLowerCase();
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow numbers, always start with +91
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('91')) {
      cleaned = cleaned;
    } else if (cleaned.length > 10) {
      cleaned = '91' + cleaned.slice(-10);
    } else {
      cleaned = '91' + cleaned;
    }
    let formatted = '+'.concat(cleaned.slice(0, 12));
    handleInputChange('clientPhone', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    // Ensure nextDate is sent as ISO string
    const submitData = { ...formData, nextDate: formData.nextDate ? new Date(formData.nextDate).toISOString() : '' };
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit(submitData);
    setIsSubmitting(false);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit New Case</h1>
          <p className="text-gray-600">Provide detailed information about your legal matter</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Case Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Case Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Case Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.caseNumber}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    placeholder="Auto-generated case number"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">This case number is automatically generated and unique</p>
              </div>

              {/* Case Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Brief, descriptive title for your case"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Case Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Type *
                </label>
                <select
                  value={formData.caseType}
                  onChange={(e) => handleInputChange('caseType', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.caseType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select case type</option>
                  {caseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.caseType && <p className="text-red-500 text-sm mt-1">{errors.caseType}</p>}
              </div>

              {/* Legal Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Section *
                </label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => handleInputChange('section', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.section ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Section 302 IPC, Section 138 NI Act, etc."
                  />
                </div>
                {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section}</p>}
                <p className="text-xs text-gray-500 mt-1">Enter the specific legal section applicable to your case</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Provide a detailed description of your legal matter, including relevant facts, dates, and any supporting information..."
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  <p className="text-sm text-gray-500 ml-auto">
                    {formData.description.length} characters (minimum 50)
                  </p>
                </div>
              </div>

              {/* Next Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Date *
                </label>
                <input
                  type="date"
                  value={formData.nextDate}
                  onChange={(e) => handleInputChange('nextDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.nextDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.nextDate && <p className="text-red-500 text-sm mt-1">{errors.nextDate}</p>}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Client Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.clientName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Your full legal name"
                  />
                </div>
                {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.clientPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="+91XXXXXXXXXX"
                    maxLength={13}
                  />
                </div>
                {errors.clientPhone && <p className="text-red-500 text-sm mt-1">{errors.clientPhone}</p>}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.clientEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.clientEmail && <p className="text-red-500 text-sm mt-1">{errors.clientEmail}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Submit Case</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CaseForm;