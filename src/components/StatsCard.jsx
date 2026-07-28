import React from 'react'

function StatsCard({ title, value, color }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}
         hover:shadow-lg transition overflow-hidden`}
    >
      <h3 className="text-gray-500 text-sm font-medium">
        {title}
      </h3>

      <h2 className="text-3xl font-bold mt-5 truncate">
  {value}
</h2>
    </div>
  );
}

export default StatsCard;
