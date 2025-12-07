import React, { useEffect, useRef } from 'react';

export default function YouTubeBackground({ videoId, playing, volume = 70 }) {
  const playerRef = useRef(null);
  const containerId = `youtube-player-${videoId}`;

  useEffect(() => {
    // Load YouTube Iframe API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      createPlayer();
    };

    // If API is already loaded, create player immediately
    if (window.YT && window.YT.Player) {
      createPlayer();
    }

    function createPlayer() {
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(containerId, {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          'autoplay': 0,
          'controls': 0,
          'disablekb': 1,
          'fs': 0,
          'loop': 1,
          'playlist': videoId // Required for loop to work
        },
        events: {
          'onReady': onPlayerReady,
        }
      });
    }

    function onPlayerReady(event) {
      event.target.setVolume(volume);
      if (playing) {
        event.target.playVideo();
      }
    }

  }, [videoId, containerId]);

  // Handle play/pause and volume updates
  useEffect(() => {
    if (playerRef.current && playerRef.current.playVideo) {
      if (playing) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
      playerRef.current.setVolume(volume);
    }
  }, [playing, volume]);

  return <div id={containerId} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />;
}