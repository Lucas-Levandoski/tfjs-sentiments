'use client';

import { useClient } from '@/hookts';

export default function ClientPage() {
  const { modelLoading, sendMessage, newMessage, setNewMessage, isLoading, messages } = useClient();

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