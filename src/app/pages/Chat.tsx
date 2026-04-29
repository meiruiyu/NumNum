import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Paperclip, Send, Star } from 'lucide-react';

export function Chat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState('');

  const friend = {
    name: 'Karen L.',
    initials: 'KL',
    bgColor: '#EAF3DE',
  };

  const messages = [
    {
      id: '1',
      type: 'received',
      text: 'Have you tried the new ramen place in Midtown? 🍜',
      timestamp: '2:30 PM',
    },
    {
      id: '2',
      type: 'restaurant-card',
      restaurant: {
        name: 'Ramen Nakamura',
        rating: 4.5,
        price: '$$',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
      },
      timestamp: '2:31 PM',
    },
    {
      id: '3',
      type: 'sent',
      text: 'OMG looks amazing, adding to my wishlist!',
      timestamp: '2:34 PM',
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#F0EBE3] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/friends-space')} className="p-1">
          <ArrowLeft className="size-5 text-[#2C1A0E]" />
        </button>
        <div
          className="size-9 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{ backgroundColor: friend.bgColor }}
        >
          {friend.initials}
        </div>
        <h1 className="text-[17px] font-semibold text-[#2C1A0E] flex-1">{friend.name}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          if (msg.type === 'received') {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-[75%]">
                  <div className="bg-[#F2EDE8] text-[#2C1A0E] px-4 py-2.5 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl text-sm leading-relaxed">
                    {msg.text}
                  </div>
                  <div className="text-[11px] text-[#8A8078] mt-1 ml-2">{msg.timestamp}</div>
                </div>
              </div>
            );
          }

          if (msg.type === 'sent') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[75%]">
                  <div className="bg-[#E8603C] text-white px-4 py-2.5 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl text-sm leading-relaxed">
                    {msg.text}
                  </div>
                  <div className="text-[11px] text-[#8A8078] mt-1 mr-2 text-right">{msg.timestamp}</div>
                </div>
              </div>
            );
          }

          if (msg.type === 'restaurant-card') {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-[75%]">
                  <div className="bg-white rounded-xl overflow-hidden border border-[#F0EBE3]">
                    <img
                      src={msg.restaurant!.image}
                      alt={msg.restaurant!.name}
                      className="w-full h-[120px] object-cover"
                    />
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-sm text-[#2C1A0E] flex-1">
                          {msg.restaurant!.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Star className="size-3 fill-[#F4A535] text-[#F4A535]" />
                          <span className="text-xs font-bold text-[#2C1A0E]">
                            {msg.restaurant!.rating}
                          </span>
                        </div>
                        <span className="text-xs text-[#8A8078]">{msg.restaurant!.price}</span>
                      </div>
                      <button className="w-full h-10 bg-[#E8603C] text-white rounded-lg text-sm font-semibold hover:bg-[#D55534] transition-colors">
                        View Restaurant
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#8A8078] mt-1 ml-2">{msg.timestamp}</div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-0 bg-white border-t border-[#F0EBE3] p-4">
        <div className="flex items-center gap-3">
          <button className="p-2 text-[#E8603C] hover:bg-[#FDF6EE] rounded-full transition-colors">
            <Paperclip className="size-5" />
          </button>
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-[#F5EDE3] rounded-full">
            <input
              type="text"
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent outline-none text-[#2C1A0E] placeholder:text-[#8A8078] text-sm"
            />
          </div>
          <button
            onClick={handleSend}
            className="size-8 bg-[#E8603C] rounded-full flex items-center justify-center hover:bg-[#D55534] transition-colors"
          >
            <Send className="size-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
