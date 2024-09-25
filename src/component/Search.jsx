import { useRef } from "react";
import "../App.css";

export default function Search({ getUser }) {
  const searchRef = useRef();

  return (
    <div className="search">
      <input type="text" ref={searchRef} />
      <button onClick={() => getUser(searchRef.current.value)}>검색</button>
    </div>
  );
}
