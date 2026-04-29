import { Link } from 'react-router';
import { MapPin, Utensils } from 'lucide-react';

export function Splash() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-6">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1766761562530-c8dd12c96d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwcmVzdGF1cmFudCUyMGZvb2QlMjBwaG90b2dyYXBoeSUyMGFzaWFufGVufDF8fHx8MTc3NDcyMjY3OXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Food background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1A0E]/70 via-[#2C1A0E]/60 to-[#2C1A0E]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#E8603C]/20 blur-2xl rounded-full" />
            <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
              <div className="flex items-center justify-center gap-2">
                <Utensils className="size-12 text-[#E8603C]" strokeWidth={2.5} />
                <MapPin className="size-12 text-[#F4A535]" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-5xl font-bold mb-3 text-white tracking-tight">
          <span className="text-[#E8603C]">NumNum</span>
          <span className="text-white"> NYC</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl text-white/90 mb-12 font-medium max-w-sm mx-auto leading-relaxed">
          Discover NYC & NJ dining, the real way.
        </p>

        {/* Buttons */}
        <div className="space-y-3 max-w-sm mx-auto">
          <Link
            to="/"
            className="block w-full bg-[#E8603C] text-white py-4 rounded-full font-bold text-lg hover:bg-[#D55534] transition-all shadow-xl hover:shadow-2xl"
          >
            Get Started
          </Link>
          <button className="w-full bg-transparent border-2 border-white/30 text-white py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
            Log In
          </button>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-0 right-0 z-10 text-center">
        <p className="text-white/60 text-sm font-medium">
          Trusted by students & food lovers across the NYC metro
        </p>
      </div>
    </div>
  );
}
