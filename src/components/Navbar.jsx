function Navbar() {
  return (
    <nav className="bg-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <h1 className="text-3xl font-bold text-white">
          🎓 Student Management System
        </h1>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center font-bold text-blue-700">
            A
          </div>

          <div>
            <h2 className="text-white font-semibold">
              Admin
            </h2>

            <p className="text-blue-100 text-sm">
              Administrator
            </p>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;