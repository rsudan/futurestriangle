
import React, { useState, useEffect } from 'react';
import { PromptTemplates } from '../types';
import { DEFAULT_SUGGESTION_PROMPT, DEFAULT_ANALYSIS_PROMPT, validateApiKey } from '../services/geminiService';
import { XMarkIcon, KeyIcon, CheckCircleIcon, ExclamationCircleIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: PromptTemplates;
  onSaveTemplates: (templates: PromptTemplates) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, templates, onSaveTemplates, apiKey, onSaveApiKey }) => {
  const [localTemplates, setLocalTemplates] = useState<PromptTemplates>(templates);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [keyStatus, setKeyStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

  useEffect(() => {
    setLocalTemplates(templates);
    setLocalApiKey(apiKey);
    setKeyStatus('idle');
  }, [templates, apiKey, isOpen]);

  if (!isOpen) return null;

  const handleResetPrompts = () => {
    if (confirm('Are you sure you want to reset all prompts to their default values?')) {
      const defaults = {
        suggestion: DEFAULT_SUGGESTION_PROMPT,
        analysis: DEFAULT_ANALYSIS_PROMPT,
      };
      setLocalTemplates(defaults);
    }
  };

  const handleTestKey = async () => {
    if (!localApiKey.trim()) {
        setKeyStatus('idle');
        return;
    }
    setKeyStatus('validating');
    const isValid = await validateApiKey(localApiKey);
    setKeyStatus(isValid ? 'valid' : 'invalid');
  };

  const handleSave = () => {
    onSaveTemplates(localTemplates);
    onSaveApiKey(localApiKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-light-card dark:bg-dark-card w-full max-w-2xl rounded-lg shadow-2xl border border-light-border dark:border-dark-border flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-light-border dark:border-dark-border">
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text flex items-center">
             Settings
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          
          {/* API Key Section */}
          <div className="space-y-4 pb-6 border-b border-light-border dark:border-dark-border">
             <h3 className="text-lg font-semibold text-light-text dark:text-dark-text flex items-center space-x-2">
                 <KeyIcon className="h-5 w-5" />
                 <span>API Configuration</span>
             </h3>
             <p className="text-sm text-gray-500 dark:text-gray-400">
                 Enter your Google Gemini API key. If left blank, the app will attempt to use the system environment variable.
             </p>
             <div className="flex space-x-2">
                 <div className="relative flex-grow">
                    <input 
                        type="password"
                        value={localApiKey}
                        onChange={(e) => {
                            setLocalApiKey(e.target.value);
                            setKeyStatus('idle');
                        }}
                        placeholder="Enter API Key (starts with AIza...)"
                        className={`w-full p-2 pl-3 pr-10 bg-light-bg dark:bg-dark-bg border rounded-md text-sm text-light-text dark:text-dark-text focus:outline-none focus:ring-2 ${keyStatus === 'invalid' ? 'border-red-500 focus:ring-red-500' : keyStatus === 'valid' ? 'border-green-500 focus:ring-green-500' : 'border-light-border dark:border-dark-border focus:ring-light-accent dark:focus:ring-dark-accent'}`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                         {keyStatus === 'valid' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                         {keyStatus === 'invalid' && <ExclamationCircleIcon className="h-5 w-5 text-red-500" />}
                    </div>
                 </div>
                 <button
                    onClick={handleTestKey}
                    disabled={!localApiKey || keyStatus === 'validating'}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                     {keyStatus === 'validating' ? 'Testing...' : 'Test Key'}
                 </button>
             </div>
             {keyStatus === 'valid' && <p className="text-xs text-green-600 dark:text-green-400">API Key is valid!</p>}
             {keyStatus === 'invalid' && <p className="text-xs text-red-600 dark:text-red-400">Invalid API Key or connection failed.</p>}
          </div>

          {/* Suggestion Prompt */}
          <div>
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">Suggestion Prompt</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Customize the prompt used to generate content for each triangle dimension.
              <br/>
              <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">{'{{topic}}'}</span>, <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">{'{{dimension}}'}</span>, and <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">{'{{explanation}}'}</span> will be replaced dynamically.
            </p>
            <textarea
              value={localTemplates.suggestion}
              onChange={(e) => setLocalTemplates(prev => ({ ...prev, suggestion: e.target.value }))}
              className="w-full h-48 p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md font-mono text-sm text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none"
            />
          </div>

          {/* Analysis Prompt */}
          <div>
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">Analysis Prompt</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Customize the prompt used to analyze the tensions between the three dimensions.
              <br/>
              <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">{'{{past}}'}</span>, <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">{'{{present}}'}</span>, and <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">{'{{future}}'}</span> will be replaced dynamically.
            </p>
            <textarea
              value={localTemplates.analysis}
              onChange={(e) => setLocalTemplates(prev => ({ ...prev, analysis: e.target.value }))}
              className="w-full h-48 p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md font-mono text-sm text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-light-border dark:border-dark-border flex justify-between items-center bg-light-bg dark:bg-dark-bg rounded-b-lg">
          <button
            onClick={handleResetPrompts}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-semibold"
          >
            Reset Prompts
          </button>
          <div className="flex space-x-3">
             <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-light-accent hover:bg-blue-700 dark:bg-dark-accent dark:hover:bg-blue-500 text-white font-semibold rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
