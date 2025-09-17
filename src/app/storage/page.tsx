'use client';

import Image from 'next/image';
import { MdCleaningServices } from 'react-icons/md';

import qrcode from '@/../public/qrcode.png';
import { useStorage } from '@/hookts';


export default function StoragePage() {
  const { clearAllMessages, floatingMessages, isLoading, containerRef } = useStorage();


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      <div 
        ref={containerRef}
        className="absolute inset-0 pt-48"
        style={{ pointerEvents: 'none' }}
      >
        {floatingMessages.map((message) => (
          <div
            key={message.id}
            className={`absolute p-3 rounded-lg shadow-lg max-w-xs transition-all duration-1000 ${message.color.bg}`}
            style={{
              left: `${message.x}px`,
              bottom: `${message.y}px`,
              opacity: message.opacity,
              transform: `scale(${message.scale})`,
              pointerEvents: 'auto'
            }}
          >
            <div className={`text-xl font-bold break-words ${message.color.text}`}>
              {message.content.length > 50 
                ? message.content.substring(0, 50) + '...' 
                : message.content
              }
            </div>
          </div>
        ))}
      </div>


      <button className="rounded-full px-3 py-3 bg-gradient-to-tr from-green-900 via-blue-900 ml-4 mt-4 cursor-pointer" onClick={() => clearAllMessages()}>
        <MdCleaningServices className='text-black size-8'/>
      </button>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6'>
        <Image src={qrcode} alt='qrcode' width={400} height={400}/>
      </div>
    </div>
  );
}