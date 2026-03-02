import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { queryClientInstance } from "./lib/query-client";

import Discover from "./pages/Discover";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import Journal from "./pages/Journal";
import PlanTrip from "./pages/PlanTrip";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import PageNotFound from "./lib/PageNotFound";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>

          {/* Public */}
          <Route path="/auth" element={<Auth />} />

          {/* Main Routes */}
          <Route path="/" element={<Discover />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/plan-trips" element={<PlanTrip />} />
          <Route path="/profile" element={<Profile />} />

          {/* 404 */}
          <Route path="*" element={<PageNotFound />} />

        </Routes>
      </Router>

      <Toaster />
    </QueryClientProvider>
  );
}

export default App;