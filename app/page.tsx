'use client';

import { useState } from 'react';
import { MapPin, Search, MessageCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { LocalityDetails } from '@/components/locality-details';
import { searchLocalities} from '@/lib/api/localities';
import { LocalityData } from '@/lib/types';

// Dynamically import map to avoid SSR issues
const LocalityMap = dynamic(() => import('@/components/locality-map'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
});

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>(['Sarjapur','Whitefield','Varthur','Electronic City']);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState<LocalityData>()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(5);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  
  // Chat-related state
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string }>>([{
    type: 'ai',
    content: 'Hello! Ask me anything about this locality.'
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow click events to fire
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://bedrock-llm-api.vercel.app/rate-locality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locality: suggestion })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch locality data');
      }

      const localityData = await response.json();
      setSelectedLocality({...localityData, name: suggestion});
      setSearchQuery(suggestion);
    } catch (err) {
      console.error('Error fetching locality data:', err);
      setError('Failed to fetch locality data');
    } finally {
      setIsLoading(false);
      setShowSuggestions(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await fetch('https://bedrock-llm-api.vercel.app/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        type: 'ai',
        content: data.answer
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Sorry, there was an error processing your request.'
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">SpotOn AI</h1>
          <div className="flex items-center gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search localities..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onBlur={handleSearchBlur}
                  className="pl-10 w-[300px] rounded-full"
                  disabled={isLoading}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-10">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                className="rounded-full bg-black hover:bg-gray-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span className="ml-2">Search</span>
                  </>
                )}
              </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Content Grid */}
        {selectedLocality ? (
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6 relative z-0">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {selectedLocality.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LocalityMap
                    name={selectedLocality.name}
                  />
                </CardContent>
              </Card>
            </div>
            
            <LocalityDetails
              onTimeRangeChange={setTimeRange}
              locality={selectedLocality}
              timeRange={timeRange}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No locality selected</h2>
            <p className="text-gray-500 mb-4">Search for a locality to view detailed information</p>
          </div>
        )}
      </div>

      {/* Chat Bubble */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Ask AI Assistant</h2>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="h-[400px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-900'}`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <form className="flex gap-2" onSubmit={handleSendMessage}>
                    <Input
                      placeholder="Ask about this locality..."
                      className="flex-1"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={isSending}
                    />
                    <Button 
                      type="submit" 
                      className="bg-black hover:bg-gray-800"
                      disabled={isSending}
                    >
                      {isSending ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        'Send'
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}