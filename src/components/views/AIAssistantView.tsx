import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Basic markdown to HTML conversion
    const htmlContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5 text-sm">$1</code>')
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-200 dark:bg-gray-700 p-2 rounded my-2 whitespace-pre-wrap"><code>$1</code></pre>')
        .replace(/(\d+)\. (.*)/g, '<li class="ml-5 list-decimal">$2</li>')
        .replace(/^- (.*)/gm, '<li class="ml-5 list-disc">$1</li>');

    return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export const AIAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await geminiService.getTroubleshootingSteps(messageText);
      const aiMessage: Message = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please check your API key and try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    sendMessage(suggestion);
  }

  const suggestedPrompts = [
      "The Zeiss microscope has a blurry image on the 40x objective.",
      "Our Thermo Orbitrap is showing a high background noise.",
      "How do I generate a maintenance checklist for an Agilent HPLC system?",
      "The sequencer is failing the initial self-test. What are the first steps?"
  ];


  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 dark:border-gray-700/50">
      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-xl font-bold text-center">AI Troubleshooting Assistant</h2>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">Describe an issue with a lab instrument to get help.</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && (
            <div className="text-center text-gray-500 pt-10">
                <h3 className="font-semibold mb-4">Try asking one of these:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
                    {suggestedPrompts.map((prompt, i) => (
                        <button key={i} onClick={() => handleSuggestionClick(prompt)} className="text-left p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xl p-3 rounded-lg shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <MarkdownRenderer content={msg.text} />
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="max-w-lg p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your problem here..."
            className="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};