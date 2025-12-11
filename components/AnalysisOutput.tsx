
import React, { useState } from 'react';
import { AnalysisResult, Source } from '../types';
import { ClipboardIcon } from './icons';

interface AnalysisOutputProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const SourceList: React.FC<{ sources: Source[] }> = ({ sources }) => {
    if (sources.length === 0) return null;

    return (
        <div className="mt-6">
            <h4 className="font-bold text-light-text dark:text-dark-text">Verified Sources:</h4>
            <ul className="list-disc list-inside space-y-2 mt-2 text-sm">
                {sources.map((source, index) => (
                    <li key={index}>
                        <a
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-light-accent dark:text-dark-accent hover:underline break-words"
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

export const AnalysisOutput: React.FC<AnalysisOutputProps> = ({ result, isLoading }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!result) return;
        const textToCopy = `
Futures Triangle Analysis
-------------------------

ANALYSIS:
${result.analysis}

SOURCES:
${result.sources.map(s => `- ${s.title}: ${s.uri}`).join('\n')}
        `;
        navigator.clipboard.writeText(textToCopy.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

  if (isLoading) {
    return (
      <div className="w-full text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-accent dark:border-dark-accent mx-auto"></div>
        <p className="mt-4 text-light-text dark:text-dark-text">Analyzing relationships and tensions...</p>
      </div>
    );
  }

  if (!result) {
    return (
        <div className="text-center py-12 px-6 bg-light-card dark:bg-dark-card rounded-lg border-2 border-dashed border-light-border dark:border-dark-border">
            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">Analysis Report</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
                Your generated analysis and sources will appear here once you click "Analyze Triangle".
            </p>
        </div>
    );
  }

  return (
    <div className="p-6 bg-light-card dark:bg-dark-card rounded-lg border border-light-border dark:border-dark-border shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">Analysis Report</h3>
            <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-light-text dark:text-dark-text rounded-md text-sm font-semibold flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
                <ClipboardIcon className="h-4 w-4" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
        </div>
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-light-text dark:text-dark-text whitespace-pre-wrap">
        {result.analysis}
      </div>
      <SourceList sources={result.sources} />
    </div>
  );
};
