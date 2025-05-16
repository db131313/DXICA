import React, { useState } from 'react';
import ControlsModal from './ControlsModal';

const ResultsPage: React.FC = () => {
  const [showControls, setShowControls] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('default');
  const [settings, setSettings] = useState({
    page: {
      backgroundImage: '',
    },
  });

  return (
    <div 
      className="min-h-screen w-full relative"
      style={{
        backgroundImage: settings.page.backgroundImage ? `url(${settings.page.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {showControls && (
        <div className="fixed top-20 right-4 z-50 w-80">
          <ControlsModal
            settings={settings}
            selectedLayout={selectedLayout}
            onLayoutChange={setSelectedLayout}
            onSettingsChange={setSettings}
            onClose={() => setShowControls(false)}
          />
        </div>
      )}

      {/* Results Grid */}
    </div>
  );
};

export default ResultsPage; 