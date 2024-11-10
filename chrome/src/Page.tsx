import { useState } from 'react';
import '../public/index.css'

const FilterBox = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>('anytime');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [videos, setVideos] = useState<any[]>([]);  // Add state for videos

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'music', label: 'Music' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'education', label: 'Education' },
    { id: 'sports', label: 'Sports' },
    { id: 'tech', label: 'Technology' },
    { id: 'coding', label: 'Coding'}
  ];

  const durations = [
    { id: 'any', label: 'Any duration' },
    { id: 'short', label: 'Under 4 minutes' },
    { id: 'medium', label: '4-20 minutes' },
    { id: 'long', label: 'Over 20 minutes' },
  ];

  const dates = [
    { id: 'anytime', label: 'Any time' },
    { id: 'hour', label: 'Last hour' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This week' },
    { id: 'month', label: 'This month' },
    { id: 'year', label: 'This year' },
  ];

  const fetchFilteredVideos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          duration: selectedDuration,
          date: selectedDate,
          query: searchQuery,
        }),
      });
      const data = await response.json();
      console.log('Filtered Videos:', data); // Handle displaying the filtered videos
      setVideos(data);  // Update the state with filtered videos
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  return (
    <div className='root-page'>
      <div className="font-extrabold ml-16 mt-7">
        <h1>Be choosy of what you watch</h1>
      </div>
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md mt-20px">
        {/* Search Bar */}
        <div className="mb-6 mt-8">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className="absolute right-2 top-2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 mb-3" 
              onClick={fetchFilteredVideos}  // Move the function here to run on click
            >
              Search
            </button>
          </div>
        </div>

        {/* Filter Sections */}
        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Duration</h3>
            <div className="flex flex-wrap gap-2">
              {durations.map((duration) => (
                <button
                  key={duration.id}
                  className={`px-4 py-2 rounded-full border ${
                    selectedDuration === duration.id
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedDuration(duration.id)}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Date Filter */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Upload Date</h3>
            <div className="flex flex-wrap gap-2">
              {dates.map((date) => (
                <button
                  key={date.id}
                  className={`px-4 py-2 rounded-full border ${
                    selectedDate === date.id
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedDate(date.id)}
                >
                  {date.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-lg font-semibold mb-2">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Category: {categories.find(c => c.id === selectedCategory)?.label}
              </span>
            )}
            {selectedDuration !== 'any' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Duration: {durations.find(d => d.id === selectedDuration)?.label}
              </span>
            )}
            {selectedDate !== 'anytime' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Date: {dates.find(d => d.id === selectedDate)?.label}
              </span>
            )}
          </div>
        </div>

        {/* Display Filtered Videos */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Filtered Videos</h3>
          <div>
            {videos.length > 0 ? (
              <ul>
                {videos.map((video, index) => (
                  <li key={index}>
                    <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                      {video.snippet.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No videos found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
