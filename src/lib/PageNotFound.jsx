import { useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-xl font-semibold">Page Not Found</h2>

        <p>
          The page <b>{pageName}</b> does not exist.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="btn-primary px-6 py-2 rounded-xl text-white"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}