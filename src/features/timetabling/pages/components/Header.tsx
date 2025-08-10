import { LogOut } from 'lucide-react'; // Import icons from lucide-react

const Header = () => (
  <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-900">ClassFlow</h1>
          <h2 className="text-lg font-semibold text-gray-700">Timeline Matrix</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Program Head BScs</span>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
