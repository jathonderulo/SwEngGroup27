import react from "react";
import Avatar from "avataaars";
import "../styles/AiAvatar.css";

export default function AiAvatar() {
  return (
    <div className="container-avatar">
      <Avatar 
        style={{width: '100%', height: '100%'}}
      />
    </div>
  );
}
