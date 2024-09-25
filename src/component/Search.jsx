import { useRef } from "react";
import "../App.css";

export default function Search(getUser) {
  const searchRef = useRef();

  return (
    <div className="search">
      <input type="text" ref={searchRef} />
      <button>검색</button>
    </div>
  );
}
