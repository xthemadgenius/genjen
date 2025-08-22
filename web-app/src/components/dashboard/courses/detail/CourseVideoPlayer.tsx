'use client';

import React, { useState } from 'react';
import styles from './css/CourseVideoPlayer.module.css';

interface CourseVideoPlayerProps {
  thumbnail: string;
  title: string;
  videoUrl?: string;
}

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({ 
  thumbnail, 
  title, 
  videoUrl 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    if (videoUrl) {
      setIsPlaying(true);
    } else {
      console.log('Video would play here');
    }
  };

  return (
    <div className={styles.videoPlayer}>
      {!isPlaying ? (
        <div className={styles.videoThumbnail} onClick={handlePlayClick}>
          <img 
            src={thumbnail} 
            alt={title}
            className={styles.thumbnailImage}
          />
          <div className={styles.playButton}>
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path 
                fill="currentColor" 
                d="M8,5.14V19.14L19,12.14L8,5.14Z"
              />
            </svg>
          </div>
          <div className={styles.videoOverlay} />
        </div>
      ) : (
        <div className={styles.videoContainer}>
          <div className={styles.videoPlaceholder}>
            <div className={styles.placeholderContent}>
              <div className={styles.placeholderIcon}>
                <svg viewBox="0 0 24 24" width="48" height="48">
                  <path 
                    fill="currentColor" 
                    d="M8,5.14V19.14L19,12.14L8,5.14Z"
                  />
                </svg>
              </div>
              <p>Video player would appear here</p>
              <button 
                className={styles.backToThumbnail}
                onClick={() => setIsPlaying(false)}
              >
                Back to Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseVideoPlayer;