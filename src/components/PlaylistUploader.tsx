import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface Props {
  onPlaylistLoad: (channels: Channel[]) => void;
}

export function PlaylistUploader({ onPlaylistLoad }: Props) {
  const handleUrlSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const url = new FormData(form).get('url') as string;
    
    try {
      const response = await fetch(url);
      const content = await response.text();
      const channels = parseM3U(content);
      onPlaylistLoad(channels);
    } catch (error) {
      alert('Failed to load playlist. Please check the URL and try again.');
    }
  }, [onPlaylistLoad]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const channels = parseM3U(content);
      onPlaylistLoad(channels);
    };
    reader.readAsText(file);
  }, [onPlaylistLoad]);

  return (
    <div className="space-y-6">
      <form onSubmit={handleUrlSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            M3U Playlist URL
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="url"
              id="url"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com/playlist.m3u"
            />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Load from URL
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".m3u,.m3u8"
                className="sr-only"
                onChange={handleFileUpload}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">M3U or M3U8 files</p>
        </div>
      </div>
    </div>
  );
}