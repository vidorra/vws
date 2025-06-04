export const dynamic = 'force-dynamic';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page - No Database</h1>
      <p>If you can see this, the Next.js app is running correctly.</p>
      <p>Current time: {new Date().toISOString()}</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold">Environment Check:</h2>
        <ul className="list-disc list-inside">
          <li>NODE_ENV: {process.env.NODE_ENV || 'not set'}</li>
          <li>DATABASE_URL: {process.env.DATABASE_URL ? 'Set ✓' : 'Not set ✗'}</li>
          <li>JWT_SECRET: {process.env.JWT_SECRET ? 'Set ✓' : 'Not set ✗'}</li>
          <li>ADMIN_EMAIL: {process.env.ADMIN_EMAIL || 'not set'}</li>
        </ul>
      </div>
    </div>
  );
}