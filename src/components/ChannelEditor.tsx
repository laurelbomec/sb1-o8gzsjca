import React from 'react';
import type { Channel } from '../types/playlist';

interface Props {
  channel: Channel | null;
  onSave: (channel: Channel) => void;
  onCancel: () => void;
}

export function ChannelEditor({ channel, onSave, onCancel }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSave({
      id: channel?.id || crypto.randomUUID(),
      name: formData.get('name') as string,
      logo: formData.get('logo') as string || undefined,
      group: formData.get('group') as string,
      url: formData.get('url') as string,
    });
  };

  if (!channel) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {channel.id ? 'Edit Channel' : 'Add Channel'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={channel.name}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-700">
              Group
            </label>
            <input
              type="text"
              name="group"
              id="group"
              defaultValue={channel.group}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <input
              type="url"
              name="logo"
              id="logo"
              defaultValue={channel.logo}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              Stream URL
            </label>
            <input
              type="url"
              name="url"
              id="url"
              defaultValue={channel.url}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}