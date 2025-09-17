import { FloatingMessage, Message } from "@/models";
import { getRandomColor } from "@/utils";
import { useEffect, useRef, useState } from "react";


export function useStorage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [floatingMessages, setFloatingMessages] = useState<FloatingMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  
  // Fetch messages on component mount and set up polling
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000); // Poll every second for real-time updates
    return () => clearInterval(interval);
  }, []);

  // Animation for movement, fade in, and wiggle
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setFloatingMessages(prev => 
        prev.map(msg => {
          // Fade in new messages
          let newOpacity = msg.opacity;
          if (msg.opacity < 1) {
            newOpacity = Math.min(msg.opacity + 0.05, 1);
          }
          
          // Slow continuous movement
          let newX = msg.x + msg.vx;
          let newY = msg.y + msg.vy;
          let newVx = msg.vx;
          let newVy = msg.vy;
          
          // Bounce off edges
          if (newX <= 0 || newX >= window.innerWidth - 300) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(newX, window.innerWidth - 300));
          }
          if (newY <= 0 || newY >= window.innerHeight - 100) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(newY, window.innerHeight - 100));
          }
          
          // Check QR code collision and bounce away
          const qrCenterX = window.innerWidth / 2;
          const qrCenterY = window.innerHeight / 2;
          const qrSize = 400;
          const buffer = 50;
          
          if (newX + 300 > qrCenterX - qrSize/2 - buffer &&
              newX < qrCenterX + qrSize/2 + buffer &&
              newY + 100 > qrCenterY - qrSize/2 - buffer &&
              newY < qrCenterY + qrSize/2 + buffer) {
            // Bounce away from QR code
            const centerDistX = newX + 150 - qrCenterX;
            const centerDistY = newY + 50 - qrCenterY;
            newVx = centerDistX > 0 ? Math.abs(newVx) : -Math.abs(newVx);
            newVy = centerDistY > 0 ? Math.abs(newVy) : -Math.abs(newVy);
          }
          
          // Wiggle animation
          let wiggleX = 0;
          let wiggleY = 0;
          let newWiggleTime = msg.wiggleTime;
          let newNextWiggle = msg.nextWiggle;
          
          if (Date.now() > msg.nextWiggle) {
            newWiggleTime = Date.now();
            newNextWiggle = Date.now() + 3000 + Math.random() * 5000; // Random 3-8 seconds
          }
          
          if (Date.now() - newWiggleTime < 500) { // Wiggle for 500ms
            const wiggleProgress = (Date.now() - newWiggleTime) / 500;
            const wiggleIntensity = Math.sin(wiggleProgress * Math.PI * 8) * (1 - wiggleProgress);
            wiggleX = wiggleIntensity * 10;
            wiggleY = wiggleIntensity * 5;
          }
          
          return {
            ...msg,        x: newX + wiggleX,        y: newY + wiggleY,        vx: newVx,        vy: newVy,        opacity: newOpacity,        scale: Math.min(msg.scale + 0.02, 1),        wiggleTime: newWiggleTime,        nextWiggle: newNextWiggle
          };
        })
      );
    }, 60);

    return () => clearInterval(animationInterval);
  }, []);

  // Add new messages as floating bubbles
  useEffect(() => {
    if (messages.length > lastMessageCount) {
      const newMessages = messages.slice(lastMessageCount);
      
      newMessages.forEach((message, index) => {
        setTimeout(() => {
          // Calculate QR code center area to avoid (400x400 QR code in center)
          const qrCenterX = window.innerWidth / 2;
          const qrCenterY = window.innerHeight / 2;
          const qrSize = 400;
          const buffer = 50; // Extra space around QR code

          let x, y;
          do {
            x = Math.random() * (window.innerWidth - 300);
            y = Math.random() * (window.innerHeight - 300) + 150;
          } while (
            // Avoid QR code area (center with buffer)
            x + 300 > qrCenterX - qrSize/2 - buffer &&
            x < qrCenterX + qrSize/2 + buffer &&
            y + 100 > qrCenterY - qrSize/2 - buffer &&
            y < qrCenterY + qrSize/2 + buffer
          );

          const newFloatingMessage: FloatingMessage = {
            ...message,        x,        y,        opacity: 0, // Start invisible for fade in effect
            scale: 0.5, // Start small
            color: getRandomColor(),        vx: (Math.random()) * 1, // Very slow random velocity
            vy: (Math.random()) * 1,        wiggleTime: 0,        nextWiggle: Date.now() + Math.random() * 5000 // First wiggle in 0-5 seconds
          };
          
          setFloatingMessages(prev => [...prev, newFloatingMessage]);
        }, index * 300); // Stagger new messages
      });

      setLastMessageCount(messages.length);
    }
  }, [messages, lastMessageCount]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        // Store messages in localStorage as backup
        localStorage.setItem('allMessages', JSON.stringify(data.messages));
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Fallback to localStorage if API fails
      const storedMessages = localStorage.getItem('allMessages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } finally {
      setIsLoading(false);
    }
  };


  const clearAllMessages = async () => {
    if (!confirm('Are you sure you want to clear all messages? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'DELETE',  });

      if (response.ok) {
        setMessages([]);
        setFloatingMessages([]);
        setLastMessageCount(0);
        localStorage.removeItem('allMessages');
        alert('All messages cleared successfully');
      } else {
        alert('Failed to clear messages');
      }
    } catch (error) {
      console.error('Failed to clear messages:', error);
      alert('Failed to clear messages');
    }
  };


  return {
    isLoading,clearAllMessages,floatingMessages,containerRef,
  }
}