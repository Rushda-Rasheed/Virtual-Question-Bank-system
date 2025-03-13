
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('/api/activity');
        setActivities(response.data.activities);
      } catch (error) {
        console.error('Error fetching activities', error);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">User Activity Log</h1>
      <ul className="space-y-4">
        {activities.map(activity => (
          <li key={activity._id} className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
            <p className="font-semibold">{activity.action}</p>
            <p className="text-sm">{activity.details}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
