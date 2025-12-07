import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { FlagGrid } from './components/FlagGrid';
import { FiltersSidebar } from './components/FiltersSidebar';
import { TopFiltersMobile } from './components/TopFiltersMobile';
import { CountryInfoPanel } from './components/CountryInfoPanel';
import { ZoomSelector } from './components/ZoomSelector';
import { FilterNotification } from './components/FilterNotification';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[var(--color-bg)]">
        {/* Header */}
        <Header />
        
        {/* Mobile Filters */}
        <TopFiltersMobile />
        
        {/* Main Content */}
        <div className="flex">
          {/* Main Area */}
          <main className="flex-1 min-w-0">
            <div className="max-w-[1400px] mx-auto px-4 py-6">
              {/* Mobile Zoom Selector */}
              <div className="sm:hidden mb-4 flex justify-center">
                <ZoomSelector />
              </div>
              
              {/* Flag Grid */}
              <FlagGrid />
            </div>
          </main>
          
          {/* Desktop Sidebar */}
          <FiltersSidebar />
        </div>
        
        {/* Country Info Panel */}
        <CountryInfoPanel />
        
        {/* Filter Notification Popup */}
        <FilterNotification />
      </div>
    </QueryClientProvider>
  );
}

export default App;
