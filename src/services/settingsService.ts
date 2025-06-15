import axios from '../config/axios';
import { Settings } from '../types/settings';

const API_URL = '/settings';

export const settingsService = {
  async getSettings(): Promise<Settings> {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async updateSettings(settings: Settings): Promise<Settings> {
    const response = await axios.put(API_URL, settings);
    return response.data;
  },
};

export async function updateSettings(settings: Settings): Promise<Settings> {
  try {
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Failed to update settings');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}
