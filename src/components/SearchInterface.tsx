import { useState } from 'react';
import { SOCIAL_PLATFORMS } from '../config';
import type { SocialPlatform } from '../types';

interface SearchInterfaceProps {
  onSearch: (keywords: string, platforms: Array<{ name: string; username?: string }>) => void;
}

export default function SearchInterface({ onSearch }: SearchInterfaceProps) {
  const [keywords, setKeywords] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(SOCIAL_PLATFORMS);
  
  const handlePlatformToggle = (index: number) => {
    const updatedPlatforms = [...platforms];
    updatedPlatforms[index].isSelected = !updatedPlatforms[index].isSelected;
    setPlatforms(updatedPlatforms);
  };

  const handleUsernameChange = (index: number, username: string) => {
    const updatedPlatforms = [...platforms];
    updatedPlatforms[index] = { ...updatedPlatforms[index], username };
    setPlatforms(updatedPlatforms);
  };

  const handleGenerate = () => {
    const selectedPlatforms = platforms.filter(p => p.isSelected);
    onSearch(keywords, selectedPlatforms);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onFocus={() => setIsMenuOpen(true)}
            placeholder="Enter keywords"
            className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <button
            onClick={handleGenerate}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors flex items-center gap-2"
          >
            <span className="material-icons text-xl">auto_awesome</span>
            Generate
          </button>
        </div>

        {/* Platform Selection Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 animate-fade-in">
            <h3 className="text-white/80 text-center mb-4 text-lg">Select all the platforms you share content on</h3>
            <p className="text-white/60 text-center text-sm mb-6">Only publicly available content will be displayed</p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {platforms.map((platform: SocialPlatform, index: number) => (
                <div
                  key={platform.name}
                  className={`p-4 rounded-xl border transition-all ${
                    platform.isSelected
                      ? 'border-white/40 bg-white/20'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img src={platform.icon} alt={platform.name} className="w-6 h-6" />
                    <span className="text-white/80">{platform.name}</span>
                    <input
                      type="checkbox"
                      checked={platform.isSelected}
                      onChange={() => handlePlatformToggle(index)}
                      className="ml-auto"
                    />
                  </div>
                  
                  {platform.isSelected && (
                    <input
                      type="text"
                      placeholder={`${platform.name} username`}
                      value={platform.username || ''}
                      onChange={(e) => handleUsernameChange(index, e.target.value)}
                      className="w-full mt-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/30"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 