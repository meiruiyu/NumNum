import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
        <Link to="/" className="text-orange-500 hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}
