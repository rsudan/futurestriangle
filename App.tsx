
import React, { useState, useEffect, useCallback } from 'react';
import { Theme, TriangleDimension, GeneratedContent, AnalysisResult, PromptTemplates } from './types';
import { Header } from './components/Header';
import { TriangleInput } from './components/TriangleInput';
import { TriangleVisualization } from './components/TriangleVisualization';
import { AnalysisOutput } from './components/AnalysisOutput';
import { SettingsModal } from './components/SettingsModal';
import { generateSuggestion, generateAnalysis, DEFAULT_SUGGESTION_PROMPT, DEFAULT_ANALYSIS_PROMPT } from './services/geminiService';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);
  
  const [pastContent, setPastContent] = useState('');
  const [presentContent, setPresentContent] = useState('');
  const [futureContent, setFutureContent] = useState('');

  const [generatedPast, setGeneratedPast] = useState<GeneratedContent | null>(null);
  const [generatedPresent, setGeneratedPresent] = useState<GeneratedContent | null>(null);
  const [generatedFuture, setGeneratedFuture] = useState<GeneratedContent | null>(null);
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const [suggestionLoading, setSuggestionLoading] = useState<TriangleDimension | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplates>({
      suggestion: DEFAULT_SUGGESTION_PROMPT,
      analysis: DEFAULT_ANALYSIS_PROMPT,
  });

  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load settings from local storage
  useEffect(() => {
      const savedTemplates = localStorage.getItem('promptTemplates');
      if (savedTemplates) {
          try {
              setPromptTemplates(JSON.parse(savedTemplates));
          } catch (e) {
              console.error("Failed to parse saved prompt templates");
          }
      }
      
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) {
          setApiKey(savedKey);
      }
  }, []);

  const handleSaveTemplates = (newTemplates: PromptTemplates) => {
      setPromptTemplates(newTemplates);
      localStorage.setItem('promptTemplates', JSON.stringify(newTemplates));
  };

  const handleSaveApiKey = (key: string) => {
      setApiKey(key);
      if (key) {
          localStorage.setItem('gemini_api_key', key);
      } else {
          localStorage.removeItem('gemini_api_key');
      }
  };

  const handleGenerateSuggestion = useCallback(async (topic: string, dimension: TriangleDimension) => {
    setSuggestionLoading(dimension);
    setError(null);
    try {
      const result = await generateSuggestion(topic, dimension, promptTemplates.suggestion, apiKey);
      switch (dimension) {
        case TriangleDimension.Past:
          setGeneratedPast(result);
          setPastContent(prev => `${prev}\n\n${result.content}`.trim());
          break;
        case TriangleDimension.Present:
          setGeneratedPresent(result);
          setPresentContent(prev => `${prev}\n\n${result.content}`.trim());
          break;
        case TriangleDimension.Future:
          setGeneratedFuture(result);
          setFutureContent(prev => `${prev}\n\n${result.content}`.trim());
          break;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setSuggestionLoading(null);
    }
  }, [promptTemplates.suggestion, apiKey]);

  const handleAnalyze = useCallback(async () => {
    setAnalysisLoading(true);
    setAnalysisResult(null);
    setError(null);
    try {
      const result = await generateAnalysis(pastContent, presentContent, futureContent, promptTemplates.analysis, apiKey);
      setAnalysisResult(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setAnalysisLoading(false);
    }
  }, [pastContent, presentContent, futureContent, promptTemplates.analysis, apiKey]);
  
  const isAnalyzeDisabled = !pastContent && !presentContent && !futureContent;

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans transition-colors">
      <Header 
        theme={theme} 
        setTheme={setTheme} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        templates={promptTemplates}
        onSaveTemplates={handleSaveTemplates}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <main className="container mx-auto p-4 md:p-8">
        
        {error && (
            <div className="my-4 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg" role="alert">
                <p><span className="font-bold">Error:</span> {error}</p>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-3">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                <div className="order-2 lg:order-1">
                    <TriangleInput
                        dimension={TriangleDimension.Past}
                        description="Historical legacies, mindsets, and systemic barriers."
                        content={pastContent}
                        setContent={setPastContent}
                        generatedData={generatedPast}
                        onGenerate={handleGenerateSuggestion}
                        isLoading={suggestionLoading === TriangleDimension.Past}
                    />
                </div>
                 <div className="order-1 lg:order-2 flex flex-col items-center">
                    <TriangleInput
                        dimension={TriangleDimension.Future}
                        description="Visions, aspirations, and preferred images of the future."
                        content={futureContent}
                        setContent={setFutureContent}
                        generatedData={generatedFuture}
                        onGenerate={handleGenerateSuggestion}
                        isLoading={suggestionLoading === TriangleDimension.Future}
                    />
                    <TriangleVisualization />
                 </div>
                <div className="order-3 lg:order-3">
                    <TriangleInput
                        dimension={TriangleDimension.Present}
                        description="Current trends, technologies, and social drivers."
                        content={presentContent}
                        setContent={setPresentContent}
                        generatedData={generatedPresent}
                        onGenerate={handleGenerateSuggestion}
                        isLoading={suggestionLoading === TriangleDimension.Present}
                    />
                </div>
             </div>
          </div>
          
          <div className="lg:col-span-3 mt-6">
            <div className="text-center">
                <button
                    onClick={handleAnalyze}
                    disabled={analysisLoading || isAnalyzeDisabled}
                    className="px-8 py-3 bg-light-accent hover:bg-blue-700 dark:bg-dark-accent dark:hover:bg-blue-500 text-white font-bold rounded-lg text-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                    {analysisLoading ? 'Analyzing...' : 'Analyze Triangle'}
                </button>
                {isAnalyzeDisabled && <p className="text-xs text-gray-500 mt-2">Please enter content in at least one field to enable analysis.</p>}
            </div>
          </div>
          
          <div className="lg:col-span-3 mt-6">
            <AnalysisOutput result={analysisResult} isLoading={analysisLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
