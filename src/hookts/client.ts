import { sentimentEmojis, Intentions, Message, Toxicity, toxicityEmojis } from "@/models";
import { useEffect, useState } from "react";
import * as toxicity from '@tensorflow-models/toxicity';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { embeddableSentiment } from "@/embeddings";
import { cosineSimilarity } from "@/utils/embedding";


export function useClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toxicityModel, setToxicityModel] = useState<toxicity.ToxicityClassifier | null>(null);
  const [sentenceEncoder, setSentenceEncoder] = useState<use.UniversalSentenceEncoder | null>(null);
  const [modelLoading, setModelLoading] = useState(true);

  // Load TensorFlow.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Loading TensorFlow.js models...');

        // Load toxicity model
        const threshold = 0.7; // Confidence threshold
        const toxicityModelPromise = toxicity.load(threshold, ['identity_attack', 'insult', 'obscene', 'severe_toxicity', 'sexual_explicit', 'threat', 'toxicity']);

        // Load Universal Sentence Encoder
        const sentenceEncoderPromise = use.load();

        // Wait for both models to load
        const [toxicityModelResult, sentenceEncoderResult] = await Promise.all([
          toxicityModelPromise,
          sentenceEncoderPromise
        ]);

        setToxicityModel(toxicityModelResult);
        setSentenceEncoder(sentenceEncoderResult);
        setModelLoading(false);
        console.log('Both models loaded successfully');
      } catch (error) {
        console.error('Failed to load models:', error);
        setModelLoading(false);
      }
    };

    loadModels();
  }, []);

  // Fetch messages on component mount and set up polling
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        // Store messages in localStorage
        localStorage.setItem('allMessages', JSON.stringify(data.messages));
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Fallback to localStorage if API fails
      const storedMessages = localStorage.getItem('allMessages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    }
  };

  const analyzeMessage = async (text: string): Promise<string> => {
    const toxic = await analyzeToxicity(text);

    if(toxic) return `${toxic} - ${text.replaceAll(/./gm, '*')}`

    const intent = await analyzeIntention(text);

    return `${intent} - ${text}`
  }

  const analyzeIntention = async(text: string): Promise<string> => {
    if(!sentenceEncoder) return '';

    let highest = -1;
    let sentiment = '';
    const textEmbedding = (await sentenceEncoder.embed(text)).arraySync()[0];

    for(const [ key, sentimentEmbedding ] of (Object.entries(embeddableSentiment) as [Intentions, number[]][])){
      const similarity = cosineSimilarity(textEmbedding, sentimentEmbedding);

      if(similarity > highest) {
        highest = similarity;
        sentiment = sentimentEmojis[key]
      }
    }

    return sentiment;
  }

  const analyzeToxicity = async (text: string): Promise<string> => {
    if (!toxicityModel) {
      return '💬';
    }

    try {
      const predictions = await toxicityModel.classify([text]);

      for (const prediction of predictions) {
        console.log(prediction.results);

        if (prediction.results[0].match) {
          return toxicityEmojis[prediction.label as Toxicity];
        }
      }
    } catch (error) {
      console.error('Error analyzing toxicity:', error);
    }
    
    return '';
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      // Analyze message for positive sentiment and get appropriate emoji
      const message = await analyzeMessage(newMessage);
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(); // Refresh messages immediately
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    modelLoading,
    sendMessage,
    newMessage,
    setNewMessage,
    sentenceEncoder,
    analyzeMessageToxicity: analyzeToxicity,
    messages,
  }
}