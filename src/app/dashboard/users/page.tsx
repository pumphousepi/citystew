import React from 'react';
import Link from 'next/link';

const UsersPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <ul className="mt-6 list-disc list-inside space-y-2">
        <li><Link href="/dashboard/users/1">User 1</Link></li>
        <li><Link href="/dashboard/users/2">User 2</Link></li>
        <li><Link href="/dashboard/users/3">User 3</Link></li>
      </ul>
    </div>
  );
};

export default UsersPage;
