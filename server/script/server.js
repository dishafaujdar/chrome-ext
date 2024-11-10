import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors()); 
const PORT = process.env.PORT || 3000;

app.use(express.json());

console.log(process.env.YOUTUBE_API_KEY)

// Endpoint to get filtered videos
app.post('/api/videos', async (req, res) => {
  const { category, duration, date, query } = req.body;
  const params = {
    part: 'snippet',
    type: 'video',
    q: query || '',
    maxResults: 10,
    key: process.env.YOUTUBE_API_KEY,
  };
  if (category !== 'all') {
    params.q +=  `${category}`;
  }
  if (date !== 'anytime') {
    const publishedAfterMap = {
      hour: new Date(Date.now() - 3600 * 1000).toISOString(),
      today: new Date(Date.now() - 86400 * 1000).toISOString(),
      week: new Date(Date.now() - 7 * 86400 * 1000).toISOString(),
      month: new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
      year: new Date(Date.now() - 365 * 86400 * 1000).toISOString(),
    };
    params.publishedAfter = publishedAfterMap[date];
  }
  // Fetch videos from YouTube API
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', { params });
    let videos = response.data.items;
    if (duration !== 'any') {
      const videoIds = videos.map(video => video.id.videoId).join(',');
      const durationResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: { part: 'contentDetails', id: videoIds, key: process.env.YOUTUBE_API_KEY },
      });

      const durationMap = {
        short: 'PT4M', 
        medium: 'PT20M', 
        long: 'PT20M', 
      };

      const isDurationMatch = (videoDuration, filterDuration) => {
        const durationSecs = parseISO8601Duration(videoDuration);
        if (filterDuration === 'short') return durationSecs < 240;
        if (filterDuration === 'medium') return durationSecs >= 240 && durationSecs <= 1200;
        if (filterDuration === 'long') return durationSecs > 1200;
        return true;
      };

      videos = videos.filter((video, index) =>
        isDurationMatch(durationResponse.data.items[index].contentDetails.duration, duration)
      );
    }

    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});
function parseISO8601Duration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  return (parseInt(match[1] || 0) * 3600) + (parseInt(match[2] || 0) * 60) + (parseInt(match[3] || 0));
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 

/*
app.get('/api/test-youtube', async (req, res) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        type: 'video',
        maxResults: 1,
        q: 'test',
        key: process.env.YOUTUBE_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'API key might be invalid or there was an error' });
  }
});
*/