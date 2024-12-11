import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Plus, Trash2 } from 'lucide-react';
import type { User } from '../types/user';
import { addDays, format } from 'date-fns';

const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  maxConnections: z.number().min(1).max(10),
  days: z.number().min(1).max(365)
});

type UserFormData = z.infer<typeof userSchema>;

interface Props {
  onClose: () => void;
  onUserCreate: (user: User) => void;
}

export function UserManager({ onClose, onUserCreate }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  });

  const onSubmit = (data: UserFormData) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      username: data.username,
      password: data.password,
      maxConnections: data.maxConnections,
      expiryDate: format(addDays(new Date(), data.days), 'yyyy-MM-dd'),
      active: true,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    onUserCreate(newUser);
    reset();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            User Management
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  {...register('username')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  {...register('password')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Max Connections</label>
                <input
                  type="number"
                  {...register('maxConnections', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.maxConnections && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxConnections.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                <input
                  type="number"
                  {...register('days', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.days && (
                  <p className="text-red-500 text-sm mt-1">{errors.days.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add User
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">User List</h3>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                  <li key={user.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                        <p className="text-sm text-gray-500">Expires: {user.expiryDate}</p>
                        <p className="text-sm text-gray-500">Max Connections: {user.maxConnections}</p>
                      </div>
                      <button
                        onClick={() => setUsers(users.filter(u => u.id !== user.id))}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}