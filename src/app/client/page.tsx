'use client';

import { useClient } from '@/hookts';
import { Intentions, sentimentEmojis } from '@/models';
import Image from 'next/image';
import Link from 'next/link';
import Lucas from '@/../public/lucas.jpg';
import Iasmim from '@/../public/iasmim.jpg';
import Workshop from '@/../public/workshop.png';
import { PiLinktreeLogo } from 'react-icons/pi';
import { BsLinkedin } from 'react-icons/bs';

export default function ClientPage() {
  const { modelLoading, sendMessage, newMessage, setNewMessage, isLoading, messages, latestSentimentAnalysis } = useClient();

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <div className='flex justify-around mb-6'>
          <Link href='https://linktr.ee/lucas_levandoski' className='flex flex-col items-center gap-4'>
            <Image src={Lucas} alt="Lucas" width={100} height={100} className='rounded-full' />
            <p className='text-blue-500 underline flex items-center gap-3' ><PiLinktreeLogo size={20} /> Linktree</p>
          </Link>
          <Link href='https://www.linkedin.com/in/oliveiasmim/' className='flex flex-col items-center gap-4'>
            <Image src={Iasmim} alt="Iasmim" width={100} height={100} className='rounded-full' />
            <p className='text-blue-500 underline flex items-center gap-3'><BsLinkedin size={20}/>LinkedIn</p>
          </Link>
        </div>
        <div className='flex w-full justify-center mb-4'>
          <Link href="https://apps.thedevconf.com/register/tdc-2025-saopaulo/workshops" className='text-xl bold'>
            <Image src={Workshop} alt="workshop" />
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 lg:p-6">
          {/* Model Loading Status */}
          {modelLoading && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
              <p className="text-yellow-800 text-sm sm:text-base">
                🧠 Carregando TensorFlow.js modelos (Positive Sentiment Analysis & Toxicity)...
              </p>
            </div>
          )}

          {/* Model Ready Status */}
          {!modelLoading &&  (
            <div className="mb-4 text-sm text-green-600">
              ✅ Modelos de Universal Sentence Encode (use) e Toxicity ativos - sua mensagem será analisada e atribuída a um sentimento
            </div>
          )}

          {/* Message Form */}
          <form onSubmit={sendMessage} className="mb-6 sm:mb-8">
            <div className="flex flex-col relative sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={modelLoading ? "Carregando modelos..." : "Digite sua mensage..."}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:border-amber-700 disabled:cursor-not-allowed"
                disabled={isLoading || modelLoading}
              />
              <button
                type="submit"
                disabled={isLoading || modelLoading || !newMessage.trim()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base font-medium whitespace-nowrap"
              >
                {isLoading ? 'Analizando...' : modelLoading ? 'Carregando...' : 'Enviado'}
              </button>
            </div>
          </form>

          {/* Sentiment Analysis Display */}
          {latestSentimentAnalysis && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                {latestSentimentAnalysis.message}
              </h3>
              
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">{latestSentimentAnalysis.emoji}</span>
                    <span className="font-medium text-gray-700 text-sm sm:text-base">
                      Ganhaodr: {latestSentimentAnalysis.winner}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
                    Confiança: {(latestSentimentAnalysis.scores[latestSentimentAnalysis.winner] * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Todos os Sentimentos:</h4>
                <div className="grid gap-2 sm:gap-3">
                  {Object.entries(latestSentimentAnalysis.scores)
                    .sort(([,a], [,b]) => b - a)
                    .map(([sentiment, score]) => (
                      <div key={sentiment} className="flex items-center gap-2 sm:gap-3">
                        <span className="w-30 sm:w-30 text-xs sm:text-sm font-medium text-gray-600 capitalize flex-shrink-0">
                          {sentimentEmojis[sentiment as Intentions]}{sentiment}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2 min-w-0">
                          <div
                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                              sentiment === latestSentimentAnalysis.winner
                                ? 'bg-blue-500'
                                : 'bg-gray-400'
                            }`}
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600 w-10 sm:w-12 text-right flex-shrink-0">
                          {(score * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}