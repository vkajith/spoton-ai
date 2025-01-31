import { LocalityData } from '../types';

export const localities = [
  { name: 'Sarjapur', coordinates: { lat: 12.8583, lng: 77.7843 } },
  { name: 'Whitefield', coordinates: { lat: 12.9698, lng: 77.7500 } },
  { name: 'Varthur', coordinates: { lat: 12.9374, lng: 77.7446 } },
  { name: 'Electronic City', coordinates: { lat: 12.8399, lng: 77.6770 } }
];

export async function searchLocalities(query: string): Promise<LocalityData | undefined> {
  try {
    const response = await fetch(`${process.env.POSTGRES_URL}/rate-locality`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locality: query })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locality data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching locality data:', error);
  }
}