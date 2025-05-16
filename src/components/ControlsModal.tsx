import React, { useState } from 'react';

interface ControlsModalProps {
  onClose: () => void;
  settings: {
    layout: {
      columnCount: number;
      gridGap: number;
    };
    page: {
      containerPadding: number;
      backgroundImage?: string;
    };
    card: {
      font: {
        family: string;
        size: number;
        color: string;
      };
      border: {
        width: number;
        color: string;
        radius: number;
      };
      height: number;
    };
  };
  selectedLayout: 'basic' | 'masonry' | 'coverflow';
  onLayoutChange: (layout: 'basic' | 'masonry' | 'coverflow') => void;
  onSettingsChange: (newSettings: ControlsModalProps['settings']) => void;
}

const fontFamilies = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Poppins',
];

export default function ControlsModal({ 
  settings, 
  selectedLayout,
  onLayoutChange,
  onSettingsChange 
}: ControlsModalProps) {
  const [activeTab, setActiveTab] = useState<'theme' | 'layout' | 'page' | 'card'>('theme');
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);

  const updateSettings = (
    category: keyof ControlsModalProps['settings'],
    subcategory: string,
    value: any
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [subcategory]: value,
      },
    };
    onSettingsChange(newSettings);
  };

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings('page', 'backgroundImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl animate-fade-in overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex gap-2">
          {(['theme', 'layout', 'page', 'card'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize text-sm ${
                activeTab === tab
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              } transition-colors`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {activeTab === 'theme' && (
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onLayoutChange('basic')}
              className={`p-3 rounded-lg border ${
                selectedLayout === 'basic'
                  ? 'border-white/40 bg-white/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              } transition-all group`}
            >
              <div className="aspect-video bg-white/10 rounded-md mb-2 overflow-hidden group-hover:bg-white/20">
                <span className="material-icons text-white/60 text-xl">grid_view</span>
              </div>
              <p className="text-white text-sm font-medium">Basic Grid</p>
              <p className="text-white/60 text-xs">Simple and clean grid layout</p>
            </button>

            <button
              onClick={() => onLayoutChange('masonry')}
              className={`p-3 rounded-lg border ${
                selectedLayout === 'masonry'
                  ? 'border-white/40 bg-white/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              } transition-all group`}
            >
              <div className="aspect-video bg-white/10 rounded-md mb-2 overflow-hidden group-hover:bg-white/20">
                <span className="material-icons text-white/60 text-xl">dashboard</span>
              </div>
              <p className="text-white text-sm font-medium">Masonry</p>
              <p className="text-white/60 text-xs">Pinterest-style dynamic grid</p>
            </button>

            <button
              onClick={() => onLayoutChange('coverflow')}
              className={`p-3 rounded-lg border ${
                selectedLayout === 'coverflow'
                  ? 'border-white/40 bg-white/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              } transition-all group`}
            >
              <div className="aspect-video bg-white/10 rounded-md mb-2 overflow-hidden group-hover:bg-white/20">
                <span className="material-icons text-white/60 text-xl">view_carousel</span>
              </div>
              <p className="text-white text-sm font-medium">Coverflow</p>
              <p className="text-white/60 text-xs">Immersive carousel experience</p>
            </button>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm">Column Count</label>
              <input
                type="range"
                min="1"
                max="6"
                value={settings.layout.columnCount}
                onChange={(e) =>
                  updateSettings('layout', 'columnCount', parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-white/60 text-xs mt-1">
                <span>1</span>
                <span>6</span>
              </div>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Grid Gap (px)</label>
              <input
                type="range"
                min="0"
                max="200"
                value={settings.layout.gridGap}
                onChange={(e) =>
                  updateSettings('layout', 'gridGap', parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-white/60 text-xs mt-1">
                <span>0px</span>
                <span>200px</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'page' && (
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm">Container Padding (px)</label>
              <input
                type="range"
                min="0"
                max="64"
                value={settings.page.containerPadding}
                onChange={(e) =>
                  updateSettings('page', 'containerPadding', parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-white/60 text-xs mt-1">
                <span>0px</span>
                <span>64px</span>
              </div>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Background Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageChange}
                className="block w-full text-sm text-white/60 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/10 file:text-white hover:file:bg-white/20"
              />
            </div>
          </div>
        )}

        {activeTab === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm">Font Family</label>
              <select
                value={settings.card.font.family}
                onChange={(e) => {
                  const newSettings = {
                    ...settings,
                    card: {
                      ...settings.card,
                      font: {
                        ...settings.card.font,
                        family: e.target.value
                      }
                    }
                  };
                  onSettingsChange(newSettings);
                }}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm"
                style={{ fontFamily: settings.card.font.family }}
              >
                {fontFamilies.map((font) => (
                  <option 
                    key={font} 
                    value={font}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Font Size (px)</label>
              <input
                type="range"
                min="12"
                max="24"
                value={settings.card.font.size}
                onChange={(e) => updateSettings('card', 'font', {
                  ...settings.card.font,
                  size: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <div className="flex justify-between text-white/60 text-xs mt-1">
                <span>12px</span>
                <span>24px</span>
              </div>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Font Color</label>
              <input
                type="color"
                value={settings.card.font.color}
                onChange={(e) => updateSettings('card', 'font', {
                  ...settings.card.font,
                  color: e.target.value
                })}
                className="w-full h-8 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Border Width (px)</label>
              <input
                type="range"
                min="0"
                max="4"
                value={settings.card.border.width}
                onChange={(e) => updateSettings('card', 'border', {
                  ...settings.card.border,
                  width: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <div className="flex justify-between text-white/60 text-xs mt-1">
                <span>0px</span>
                <span>4px</span>
              </div>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Border Color</label>
              <input
                type="color"
                value={settings.card.border.color}
                onChange={(e) => updateSettings('card', 'border', {
                  ...settings.card.border,
                  color: e.target.value
                })}
                className="w-full h-8 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Border Radius (px)</label>
              <input
                type="range"
                min="0"
                max="24"
                value={settings.card.border.radius}
                onChange={(e) => updateSettings('card', 'border', {
                  ...settings.card.border,
                  radius: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <div className="flex justify-between text-white/60 text-xs mt-1">
                <span>0px</span>
                <span>24px</span>
              </div>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Card Height (px)</label>
              <input
                type="range"
                min="200"
                max="500"
                value={settings.card.height}
                onChange={(e) =>
                  updateSettings('card', 'height', parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="flex justify-between text-white/60 text-xs mt-1">
                <span>200px</span>
                <span>500px</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 