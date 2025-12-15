import { useState } from 'react';
import UsersList from './UsersList';
import Alert from '../../components/ui/Alert';

export default function UsersPage() {
  const [alert, setAlert] = useState(null);

  return (
    <div style={{ padding: '2rem' }}>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <UsersList />
    </div>
  );
}