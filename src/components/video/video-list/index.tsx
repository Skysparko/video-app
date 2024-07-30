import React, { useEffect, useState } from 'react';
import { Video } from '../../../types/video';
import api from '../../../config/axios.config';

type TProps = {
  videos:Video[],
  fetchVideos:()=> void;
}

const VideoList = (props:TProps) => {
  const {videos,fetchVideos} = props

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`videos/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchVideos();
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Video List</h2>
      <ul className="space-y-4">
        {videos.map(video => (
          <li key={video._id} className="flex flex-col items-center p-4 border rounded-lg shadow-md hover:bg-gray-100 transition">
            <video
              controls
              className="w-full max-w-md h-auto mb-4 border rounded-lg"
              src={"http://localhost:5000"+video.url} // Ensure 'video.url' points to the correct video source
              // alt={video.filename}
            />
            <div className="flex-1 text-center">
              {/* <h3 className="text-lg font-semibold mb-2">{video.filename}</h3> */}
              {/* <p className="text-sm text-gray-600">{video.}</p> Assuming you have a description field */}
            </div>
            <button
              onClick={() => handleDelete(video._id)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
