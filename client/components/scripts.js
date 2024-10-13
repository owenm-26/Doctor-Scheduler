import { useRef, useEffect } from 'react';

export const useWebRTCSender = (videoRef) => {
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);

  const initWebRTC = async () => {
    try {
      peerConnectionRef.current = new RTCPeerConnection();

      // Create data channel
      dataChannelRef.current = peerConnectionRef.current.createDataChannel('videoData');

      // Create and set local description
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      // Here you would typically send the offer to your signaling server
      // and wait for an answer. For this example, we'll skip that part.
      console.log('Offer created:', offer);

      // In a real application, you'd receive the answer from the server and do:
      // await peerConnectionRef.current.setRemoteDescription(answer);

    } catch (error) {
      console.error('Error initializing WebRTC:', error);
    }
  };

  const sendVideoFrame = () => {
    if (!videoRef.current || !dataChannelRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.5);
    dataChannelRef.current.send(imageData);
  };

  useEffect(() => {
    initWebRTC();

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

  return { sendVideoFrame };
};