import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-6xl font-bold text-orange-500 mb-4">Oops!</h1>
            <p className="text-xl text-gray-300 mb-8">Sorry, an unexpected error has occurred.</p>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-lg w-full text-left overflow-auto">
                <p className="text-red-400 font-mono text-sm">
                    {error.statusText || error.message}
                </p>
                {error.status === 404 && <p className="mt-2">The page you are looking for does not exist.</p>}
            </div>
            <Link to="/dashboard" className="mt-8 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold transition">
                Go to Dashboard
            </Link>
        </div>
    );
}
