import { FileText } from 'lucide-react';

const Sidebar = () => (
  <aside className="w-64 flex-shrink-0">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <nav className="space-y-2">
        {/* These can be placeholders or link to future routes */}
        <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
          <FileText className="w-4 h-4" />
          Go to My Matrix
        </button>
        {/* ... other sidebar buttons */}
      </nav>
    </div>
  </aside>
);

export default Sidebar;
