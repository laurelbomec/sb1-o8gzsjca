export function parseM3U(content: string): Channel[] {
  const lines = content.split('\n');
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};

  lines.forEach((line) => {
    line = line.trim();
    
    if (line.startsWith('#EXTINF:')) {
      const match = line.match(/group-title="([^"]*)".*,(.*)$/);
      if (match) {
        currentChannel.group = match[1] || 'Uncategorized';
        currentChannel.name = match[2].trim();
      }
    } else if (line.startsWith('#EXTLOGO:')) {
      currentChannel.logo = line.substring(9).trim();
    } else if (line && !line.startsWith('#')) {
      currentChannel.url = line;
      currentChannel.id = crypto.randomUUID();
      channels.push(currentChannel as Channel);
      currentChannel = {};
    }
  });

  return channels;
}

export function generateM3U(playlist: Playlist): string {
  let content = '#EXTM3U\n';
  
  playlist.channels.forEach((channel) => {
    content += `#EXTINF:-1 group-title="${channel.group}",${channel.name}\n`;
    if (channel.logo) {
      content += `#EXTLOGO:${channel.logo}\n`;
    }
    content += `${channel.url}\n`;
  });

  return content;
}