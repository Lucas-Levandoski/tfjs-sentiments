
export function getRandomColor() {
  const colors = [
    { bg: 'bg-blue-500', text: 'text-white' },
    { bg: 'bg-green-500', text: 'text-white' }, 
    { bg: 'bg-purple-500', text: 'text-white' },
    { bg: 'bg-red-500', text: 'text-white' },
    { bg: 'bg-yellow-500', text: 'text-black' },
    { bg: 'bg-pink-500', text: 'text-white' },
    { bg: 'bg-indigo-500', text: 'text-white' },
    { bg: 'bg-teal-500', text: 'text-white' },
    { bg: 'bg-orange-500', text: 'text-white' },
    { bg: 'bg-cyan-500', text: 'text-black' },
    { bg: 'bg-lime-500', text: 'text-black' },
    { bg: 'bg-rose-500', text: 'text-white' }
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};