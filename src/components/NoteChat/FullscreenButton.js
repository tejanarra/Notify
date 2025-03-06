import { IoExpand, IoContract } from "react-icons/io5";

export default function FullscreenButton({ fullScreen, setFullScreen }) {
  return (
    <button
      onClick={() => setFullScreen(!fullScreen)}
      className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
      aria-label={fullScreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {fullScreen ? <IoContract size={18} /> : <IoExpand size={18} />}
    </button>
  );
}
