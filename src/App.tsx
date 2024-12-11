import React, { useState } from 'react';
import { PlaylistUploader } from './components/PlaylistUploader';
import { ChannelList } from './components/ChannelList';
import { ChannelEditor } from './components/ChannelEditor';
import { UserManager } from './components/UserManager';
import { Download, Plus, Users } from 'lucide-react';
import type { Channel, Playlist } from './types/playlist';
import type { User, XtreamCredentials } from './types/user';
import { generateM3U } from './utils/m3uParser';
import { generateXtreamCredentials, convertToXtreamFormat } from './utils/xtreamConverter';

function App() {
  const [playlist, setPlaylist] = useState<Playlist>({ name: 'My Playlist', channels: [] });
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [showUserManager, setShowUserManager] = useState(false);
  const [xtreamCredentials, setXtreamCredentials] = useState<XtreamCredentials | null>(null);

  const handlePlaylistLoad = (channels: Channel[]) => {
    setPlaylist(prev => ({ ...prev, channels }));
    const creds = generateXtreamCredentials(playlist);
    setXtreamCredentials(creds);
  };

  const handleAddChannel = () => {
    setEditingChannel({
      id: '',
      name: '',
      group: '',
      url: '',
    });
  };

  const handleSaveChannel = (channel: Channel) => {
    setPlaylist(prev => ({
      ...prev,
      channels: channel.id
        ? prev.channels.map(ch => ch.id === channel.id ? channel : ch)
        : [...prev.channels, channel]
    }));
    setEditingChannel(null);
  };

  const handleDeleteChannel = (channelId: string) => {
    setPlaylist(prev => ({
      ...prev,
      channels: prev.channels.filter(ch => ch.id !== channelId)
    }));
  };

  const handleDownload = () => {
    const content = generateM3U(playlist);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playlist.m3u';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUserCreate = (user: User) => {
    if (xtreamCredentials) {
      const xtreamChannels = convertToXtreamFormat(playlist.channels, xtreamCredentials);
      console.log('User created:', user);
      console.log('Xtream channels:', xtreamChannels);
      // Here you would typically save this data to a backend
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">IPTV Playlist Editor</h1>
            <div className="space-x-4">
              <button
                onClick={handleAddChannel}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Channel
              </button>
              {playlist.channels.length > 0 && (
                <>
                  <button
                    onClick={() => setShowUserManager(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Manage Users
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download M3U
                  </button>
                </>
              )}
            </div>
          </div>

          {playlist.channels.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6">
              <PlaylistUploader onPlaylistLoad={handlePlaylistLoad} />
            </div>
          ) : (
            <ChannelList
              channels={playlist.channels}
              onEditChannel={setEditingChannel}
              onDeleteChannel={handleDeleteChannel}
            />
          )}

          {editingChannel && (
            <ChannelEditor
              channel={editingChannel}
              onSave={handleSaveChannel}
              onCancel={() => setEditingChannel(null)}
            />
          )}

          {showUserManager && (
            <UserManager
              onClose={() => setShowUserManager(false)}
              onUserCreate={handleUserCreate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;