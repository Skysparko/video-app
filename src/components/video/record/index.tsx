import React, { useState, useRef, useEffect } from "react";
import api from "../../../config/axios.config";
import VideoList from "../video-list/index";
import { Video } from "../../../types/video";
import Header from '../../header/index';

const VideoRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  const startRecording = async () => {
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(newStream);

    if (videoRef.current) {
      videoRef.current.srcObject = newStream;
      videoRef.current.play(); // Ensure video is playing
    } else {
      console.error("Video reference is not available.");
    }

    mediaRecorderRef.current = new MediaRecorder(newStream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/mp4" });
      setVideoURL(URL.createObjectURL(blob));
      chunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Stop all tracks of the stream
    }
    setRecording(false);
  };

  const saveVideo = async () => {
    if (videoURL) {
      const blob = await fetch(videoURL).then((res) => res.blob());
      const formData = new FormData();
      formData.append("video", blob, "video.mp4");

      await api.post("videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVideoURL(null);
      fetchVideos()
    }
  };

  const discardVideo = () => {
    setVideoURL(null);
  };

  const fetchVideos = async () => {
    try {
      const response = await api.get("videos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVideos(response.data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    }
  };

  return (
    <>
    <Header/>
    <div className=" grid container max-xl:flex max-xl:flex-col mx-auto justify-center grid-cols-3 items-center p-4 space-y-4">
      {!recording && !videoURL && (
        <div className="relative w-full max-w-md flex flex-col gap-5">
          <img
            src={
              "https://img.freepik.com/premium-vector/video-player-template-web-mobile-apps-concept-vector-illustration_402975-60.jpg"
            }
            alt="Placeholder"
            className="mt-5 w-full h-auto object-cover rounded-lg shadow-md"
          />
          <button
            onClick={startRecording}
            className=" inset-0 flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded-lg opacity-75 hover:opacity-100 transition-opacity"
          >
            Start Recording
          </button>
        </div>
      )}

      <div
        className={`relative w-full max-w-md ${
          recording ? "flex flex-col gap-5" : "hidden"
        }`}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          className="mt-5 w-full h-auto object-cover rounded-lg shadow-md"
        />
        <button
          onClick={stopRecording}
          className=" inset-0 flex items-center justify-center bg-red-500 text-white font-bold py-2 px-4 rounded-lg opacity-75 hover:opacity-100 transition-opacity"
        >
          Stop Recording
        </button>
      </div>

      {videoURL && (
        <div className="flex flex-col items-center w-full max-w-md space-y-4">
          <video
            src={videoURL}
            controls
            className="w-full h-auto rounded-lg shadow-md"
          />
          <div className="flex space-x-4">
            <button
              onClick={saveVideo}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={discardVideo}
              className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}
      <div className="col-span-2">
      <VideoList videos={videos} fetchVideos={fetchVideos} />
      </div>
    </div>
    </>
  );
};

export default VideoRecorder;
