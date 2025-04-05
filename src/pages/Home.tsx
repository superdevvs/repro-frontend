
import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Real Estate Photography Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Professional Photography</h2>
          <p className="text-gray-600 dark:text-gray-300">
            High-quality real estate photography to showcase properties in the best light.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Virtual Tours</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Interactive 3D virtual tours that let buyers explore properties from anywhere.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
