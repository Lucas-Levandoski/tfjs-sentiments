import { Intentions, Toxicity } from "./intentions";

export const sentimentEmojis : { [key in Intentions]: string} = {
  celebration: '🎉',
  encouragement: '💪',
  funny: '😂',
  gratitude: '🙏',
  happiness: '😊',
  love: '❤️',
  positivity: '👍',
  question: '❓',
  sadness: '😢',
}

export const toxicityEmojis: { [ key in Toxicity]: string } = {
  identity_attack: '🚫',
  insult: '😡',
  obscene: '🔞',
  severe_toxicity: '💀',
  sexual_explicit: '🔞',
  threat: '⚠️',
  toxicity: '⚠️',
}
