
import React, { useState } from 'react';
import { TriangleDimension, GeneratedContent, Source } from '../types';
import { SparklesIcon } from './icons';

interface TriangleInputProps {
  dimension: TriangleDimension;
  description: string;
  content: string;
  setContent: (value: string) => void;
  generatedData: GeneratedContent | null;
  onGenerate: (topic: string, dimension: TriangleDimension) => void;
  isLoading: boolean;
}

const SourceList: React.FC<{ sources: Source[] }> = ({ sources }) => {
    if (sources.length === 0) return null;

    return (
        <div className="mt-4">
            <h4 className="font-semibold text-sm text-light-text dark:text-dark-text">Sources:</h4>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                {sources.map((source, index) => (
                    <li key={index}>
                        <a
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-light-accent dark:text-dark-accent hover:underline break-all"
                            title={source.title}
                        >
                            {source.title || source.uri}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const ConfidenceMeter: React.FC<{ value: number }> = ({ value }) => {
    const getColor = (v: number) => {
        if (v > 75) return 'bg-green-500';
        if (v > 50) return 'bg-yellow-500';
        return 'bg-red-500';
    }
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
            <div
                className={`h-2.5 rounded-full ${getColor(value)}`}
                style={{ width: `${value}%` }}
            ></div>
        </div>
    );
}

export const TriangleInput: React.FC<TriangleInputProps> = ({ dimension, description, content, setContent, generatedData, onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleGenerateClick = () => {
    if (topic.trim()) {
      onGenerate(topic, dimension);
    }
  };

  return (
    <div className="p-4 bg-light-card dark:bg-dark-card rounded-lg border border-light-border dark:border-dark-border shadow-md h-full flex flex-col">
      <h3 className="text-lg font-bold text-light-accent dark:text-dark-accent">{dimension}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      
      <div className="flex space-x-2 mb-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a keyword for AI..."
          className="flex-grow bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md px-3 py-2 text-sm text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none"
        />
        <button
          onClick={handleGenerateClick}
          disabled={isLoading || !topic.trim()}
          className="px-4 py-2 bg-light-accent hover:bg-blue-700 dark:bg-dark-accent dark:hover:bg-blue-500 text-white font-semibold rounded-md flex items-center space-x-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <SparklesIcon className="h-4 w-4" />
          <span>Generate</span>
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full p-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md text-sm text-light-text dark:text-dark-text focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:outline-none flex-grow"
        placeholder={`Describe the ${dimension.toLowerCase()}...`}
      />
      {generatedData && (
         <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
             <p className="text-sm text-light-text dark:text-dark-text">{generatedData.content}</p>
             <div className="mt-3">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">AI Confidence: {generatedData.confidence}%</p>
                <ConfidenceMeter value={generatedData.confidence} />
             </div>
             <SourceList sources={generatedData.sources} />
         </div>
      )}
    </div>
  );
};
