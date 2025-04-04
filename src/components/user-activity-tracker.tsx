'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function UserActivityTracker() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    // Function to update user's last active time
    const updateUserActivity = async () => {
      try {
        await fetch('/api/user/activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error updating user activity:', error);
      }
    };

    // Update activity when component mounts
    updateUserActivity();

    // Set up interval to update activity every 5 minutes
    const intervalId = setInterval(updateUserActivity, 5 * 60 * 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [session]);

  // This component doesn't render anything
  return null;
} 