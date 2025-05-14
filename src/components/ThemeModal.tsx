export interface ThemeModalProps {
  onClose: () => void;
  onSelect: (theme: 'basic' | 'masonry' | 'coverflow') => void;
  selectedLayout: 'basic' | 'masonry' | 'coverflow';
}

const ThemeModal = ({ onClose, onSelect, selectedLayout }: ThemeModalProps) => (
  <>
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]" onClick={onClose} />
    <div className="fixed inset-0 flex items-center justify-center z-[75]">
      <div className="bg-gray-900/95 p-8 rounded-2xl border border-white/20 max-w-md w-full mx-4 shadow-2xl animate-fade-in">
        <h3 className="text-2xl font-semibold text-white mb-6">Select Your Layout</h3>
        <div className="space-y-4">
          <button
            onClick={() => onSelect('basic')}
            className={`w-full p-4 rounded-xl ${
              selectedLayout === 'basic' ? 'bg-white/20' : 'bg-white/5'
            } hover:bg-white/10 text-white text-left transition-all group`}
          >
            <div className="flex items-center gap-3">
              <span className="material-icons text-2xl group-hover:scale-110 transition-transform">grid_view</span>
              <div>
                <p className="font-medium">Basic Grid</p>
                <p className="text-sm text-white/60">Simple and clean grid layout</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => onSelect('masonry')}
            className={`w-full p-4 rounded-xl ${
              selectedLayout === 'masonry' ? 'bg-white/20' : 'bg-white/5'
            } hover:bg-white/10 text-white text-left transition-all group`}
          >
            <div className="flex items-center gap-3">
              <span className="material-icons text-2xl group-hover:scale-110 transition-transform">dashboard</span>
              <div>
                <p className="font-medium">Masonry Layout</p>
                <p className="text-sm text-white/60">Pinterest-style dynamic grid</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => onSelect('coverflow')}
            className={`w-full p-4 rounded-xl ${
              selectedLayout === 'coverflow' ? 'bg-white/20' : 'bg-white/5'
            } hover:bg-white/10 text-white text-left transition-all group`}
          >
            <div className="flex items-center gap-3">
              <span className="material-icons text-2xl group-hover:scale-110 transition-transform">view_carousel</span>
              <div>
                <p className="font-medium">Coverflow</p>
                <p className="text-sm text-white/60">Immersive carousel experience</p>
              </div>
            </div>
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all"
        >
          Close
        </button>
      </div>
    </div>
  </>
);

export default ThemeModal; 