import React, { useEffect, useState } from "react";
import Avatar from "avataaars";
import "../styles/AiAvatar.css";

// Delay (in ms) between each animation frame
const frameIntervalDuration = 200;
// Scalar for speech duration
const speakDurationScalar = 0.1;

export default function AiAvatar({
  messages,
  avatarStyle = "",
  topType = "",
  accessoriesType = "",
  hairColor = "",
  facialHairType = "",
  clotheType = "",
  clotheColor = "",
  eyeType = "",
  eyebrowType = "",
  skinColor = "",
}) {
  const speakFrames = ["Smile", "Default"];

  const [frameInterval, setFrameInterval] = useState(0);
  const [speakDuration, setSpeakDuration] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);

  // setInterval(() => {
  //   console.log(frameInterval + " " + speakDuration);
  //   if (frameInterval <= speakDuration) {
  //     setFrameInterval((prevFrameInterval) => {
  //       return prevFrameInterval + 1;
  //     });
  //   }
  // }, frameIntervalDuration);

  var intervalId = null;

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender == "ai") {
        if (messages.length != messagesCount) {
          setMessagesCount(messages.length);
          setFrameInterval(0);

          clearInterval(intervalId);
          intervalId = setInterval(() => {
            console.log(frameInterval + " " + speakDuration);
            if (frameInterval <= speakDuration) {
              setFrameInterval((prevFrameInterval) => {
                return prevFrameInterval + 1;
              });
            }
          }, frameIntervalDuration);
        }
        setSpeakDuration(lastMessage.text.length * speakDurationScalar);
      }
    }
  }, [
    messages,
    messagesCount,
    frameInterval,
    speakDuration,
    speakDurationScalar,
    frameIntervalDuration,
  ]);

  // Current number of animation frames remaining
  // const [speakDuration, setSpeakDuration] = useState(0);

  // // Speech animation effect
  // useEffect(() => {
  //   if (messages.length > 0) {
  //     const lastMessage = messages[messages.length - 1];
  //     if (lastMessage.sender == "ai") {
  //       // Determine number of speach frames.
  //       setSpeakDuration(Math.trunc(lastMessage.text.length * speakDurationScalar));

  //       // Sequence animation frames
  //       const intervalId = setInterval(() => {
  //         setSpeakDuration((prevSpeakDuration) => {
  //           if (prevSpeakDuration > 0) {
  //             return prevSpeakDuration - 1;
  //           } else {
  //             clearInterval(intervalId);
  //             return 0;
  //           }
  //         });
  //       }, frameInterval);
  //     } else {
  //       // Cancel current speech animation when user submits a message
  //       setSpeakDuration(0);
  //     }
  //   }
  // }, [messages]);

  return (
    <div className="container-avatar">
      <Avatar
        style={{ width: "100%", height: "100%" }}
        // mouthType={
        //   speakDuration > 0
        //     ? speakFrames[speakDuration % speakFrames.length]
        //     : "Default"
        // }
        mouthType={
          frameInterval < speakDuration
            ? speakFrames[frameInterval % speakFrames.length]
            : "Default"
        }
        avatarStyle={avatarStyle}
        topType={topType}
        accessoriesType={accessoriesType}
        hairColor={hairColor}
        facialHairType={facialHairType}
        clotheType={clotheType}
        clotheColor={clotheColor}
        eyeType={eyeType}
        eyebrowType={eyebrowType}
        skinColor={skinColor}
      />
    </div>
  );
}
