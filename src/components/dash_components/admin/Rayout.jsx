import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Your header and main content would go here */}
        {children}
      </div>
    </div>
  );
};