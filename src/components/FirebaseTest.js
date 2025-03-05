import { useEffect } from 'react';
import { database, auth } from '../firebase';
import { ref, set } from 'firebase/database';

export default function FirebaseTest() {
  useEffect(() => {
    // Write test data
    const testRef = ref(database, 'testConnection');
    set(testRef, {
      message: "Firebase is connected!",
      timestamp: Date.now()
    });
    
    // Cleanup
    return () => set(testRef, null);
  }, []);

  return (
    <div className="p-4 bg-green-100">
      Firebase connection established! Check your database.
    </div>
  );
}