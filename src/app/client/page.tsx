'use client';

import { useClient } from '@/hookts';
import { Intentions, sentimentEmojis } from '@/models';

export default function ClientPage() {
  const { modelLoading, sendMessage, newMessage, setNewMessage, isLoading, messages, latestSentimentAnalysis } = useClient();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Message Client</h1>


          {/* Model Loading Status */}
          {modelLoading && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
              <p className="text-yellow-800">🧠 Loading TensorFlow.js models (Positive Sentiment Analysis)...</p>
            </div>
          )}

          {/* Message Form */}
          <form onSubmit={sendMessage} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={modelLoading ? "Loading AI model..." : "Type your message here..."}
                className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || modelLoading}
              />
              <button
                type="submit"
                disabled={isLoading || modelLoading || !newMessage.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Analyzing...' : modelLoading ? 'Loading...' : 'Send'}
              </button>
            </div>
          </form>

          {/* Sentiment Analysis Results */}
          {latestSentimentAnalysis && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🎯 Sentiment Analysis for: &quot;{latestSentimentAnalysis.message}&quot;
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Winner */}
                <div className="bg-white text-gray-700 p-3 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold mb-1">🏆 Detected Sentiment</h4>
                  <div className="text-2xl">
                    {latestSentimentAnalysis.emoji} {latestSentimentAnalysis.winner}
                  </div>
                  <div className="text-sm text-gray-600">
                    {(latestSentimentAnalysis.scores[latestSentimentAnalysis.winner] * 100).toFixed(1)}% confidence
                  </div>
                </div>

                {/* All Scores */}
                <div className="bg-white text-gray-700 p-3 rounded-lg">
                  <h4 className="font-semibold mb-2">📊 All Sentiment Scores</h4>
                  <div className="space-y-1">
                    {Object.entries(latestSentimentAnalysis.scores)
                      .sort(([,a], [,b]) => b - a)
                      .map(([sentiment, score]) => (
                        <div key={sentiment} className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-1">
                            <span className="text-lg">
                              {sentimentEmojis[sentiment as Intentions]}
                            </span>
                            {sentiment}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${score * 100}%` }}
                              ></div>
                            </div>
                            <span className="w-12 text-right font-mono">
                              {(score * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Model Ready Status */}
          {!modelLoading &&  (
            <div className="mb-4 text-sm text-green-600">
              ✅ AI toxicity detection enabled - messages will be analyzed and tagged with emojis
            </div>
          )}

          {/* Messages Display */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Your Messages ({messages.length})
            </h2>

            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">You haven`t sent any messages yet. Send your first message above!</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages
                  .slice(0, 20)
                  .map((message) => (
                    <div
                      key={message.id}
                      className="p-4 rounded-lg bg-blue-100 border-l-4 border-blue-500"
                    >
                      <p className="text-gray-800">{message.content}</p>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}