import { socket } from '@/common/lib/socket';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { IoMicOff, IoMic } from "react-icons/io5";


const MyAudio = () => {
  const router = useRouter()
  const roomId = (router.query.roomId || "").toString()
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const audioElements: { [userId: string]: HTMLAudioElement } = {};

  useEffect(() => {
    socket.on("user_toggled_mic", (userId: string, micStatus: boolean) => {
      if (micStatus) {
        const audio = new Audio();
        audioElements[userId] = audio;

        if (localStream) {
          audio.srcObject = localStream;
          audio.play();
        }
      } else {
        if (audioElements[userId]) {
          audioElements[userId].pause();
          delete audioElements[userId];
        }
      }
    });

    return () => {
      socket.off("user_toggled_mic");
    };
  }, [socket, localStream]);

  const toggleMic = async () => {
    if (!isMicOn) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);

      stream.getTracks().forEach((track) => {
        track.enabled = true;
      });

      socket.emit("toggle_mic", roomId, true);
    } else {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      socket.emit("toggle_mic", roomId, false);
    }
    setIsMicOn(!isMicOn);
  };

  return (
    <button
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 border border-[#3C3C3C] bg-[#252526] text-xl rounded-full p-3 text-[#D4D4D4]"
      onClick={toggleMic}
    >
      {isMicOn ? <IoMic /> : <IoMicOff />}
    </button>
  );
};

export default MyAudio;
