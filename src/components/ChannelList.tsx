import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import type { Channel } from '../types/playlist';

interface Props {
  channels: Channel[];
  onEditChannel: (channel: Channel) => void;
  onDeleteChannel: (channelId: string) => void;
}

export function ChannelList({ channels, onEditChannel, onDeleteChannel }: Props) {
  const groups = channels.reduce((acc, channel) => {
    const group = channel.group || 'Uncategorized';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([group, groupChannels]) => (
        <div key={group} className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">{group}</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {groupChannels.map((channel) => (
                <li key={channel.id}>
                  <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                    <div className="flex items-center">
                      {channel.logo && (
                        <img
                          src={channel.logo}
                          alt={channel.name}
                          className="h-10 w-10 rounded-full mr-4"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{channel.name}</h4>
                        <p className="text-sm text-gray-500">{channel.url}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditChannel(channel)}
                        className="p-2 text-gray-400 hover:text-gray-500"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDeleteChannel(channel.id)}
                        className="p-2 text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}