import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICON_URLS = {
  instagram: 'https://cdn.simpleicons.org/instagram/white',
  tiktok: 'https://cdn.simpleicons.org/tiktok/white',
  youtube: 'https://cdn.simpleicons.org/youtube/white',
  spotify: 'https://cdn.simpleicons.org/spotify/white',
  facebook: 'https://cdn.simpleicons.org/facebook/white',
  substack: 'https://cdn.simpleicons.org/substack/white',
  soundcloud: 'https://cdn.simpleicons.org/soundcloud/white',
  calendly: 'https://cdn.simpleicons.org/calendly/white',
  x: 'https://cdn.simpleicons.org/x/white',
  reddit: 'https://cdn.simpleicons.org/reddit/white',
  linkedin: 'https://cdn.simpleicons.org/linkedin/white',
  twitch: 'https://cdn.simpleicons.org/twitch/white',
  vimeo: 'https://cdn.simpleicons.org/vimeo/white',
  discord: 'https://cdn.simpleicons.org/discord/white',
  medium: 'https://cdn.simpleicons.org/medium/white',
  threads: 'https://cdn.simpleicons.org/threads/white',
  bluesky: 'https://cdn.simpleicons.org/bluesky/white',
  snapchat: 'https://cdn.simpleicons.org/snapchat/white',
  pinterest: 'https://cdn.simpleicons.org/pinterest/white',
  amazon: 'https://cdn.simpleicons.org/amazon/white',
};

const ICONS_DIR = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Download each icon
Object.entries(ICON_URLS).forEach(([name, url]) => {
  const filePath = path.join(ICONS_DIR, `${name}.svg`);
  https.get(url, (response) => {
    const file = fs.createWriteStream(filePath);
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${name} icon`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${name} icon:`, err);
  });
}); 