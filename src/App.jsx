import { useEffect, useReducer } from "react";
import { SUCCESS, LOADING, ERROR } from "./const";
import "./App.css";
import Search from "./component/Search";
import Repos from "./component/Repos";

function App() {
  const initState = {
    // api를 호출했을 때 로딩 유무
    loading: false,
    // api를 호출했을 때 에러 확인
    error: null,
    // api를 호출했을 때 데이터 넣기
    user: null,
    repos: null,
  };

  const [state, dispatch] = useReducer(reducer, initState);

  async function getUser(userId = "zinee81") {
    dispatch({ type: LOADING });
    try {
      const key = import.meta.env.VITE_GIT_API_KEY;
      const user_response = await fetch(`https://api.github.com/users/${userId}`, {
        headers: {
          Authorization: key,
          "User-Agent": "zinee",
        },
      });

      if (!user_response.ok) {
        // 404 오류 처리
        if (user_response.status === 404) {
          dispatch({ type: ERROR, error: "사용자가 없습니다." });
        } else {
          const errorData = await user_response.json();
          dispatch({ type: ERROR, error: errorData.message });
        }
        return; // 더 이상 진행하지 않도록 리턴
      }

      const user = await user_response.json();

      const repos_response = await fetch(`https://api.github.com/users/${userId}/repos?sort=created`, {
        headers: {
          Authorization: key,
          "User-Agent": "zinee",
        },
      });

      const repos = await repos_response.json();
      dispatch({ type: SUCCESS, user: user, repos: repos });
    } catch (e) {
      dispatch({ type: ERROR, error: e.message });
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  // 3가지 액션 생성
  // SUCCESS : 데이터를 가져오는데 성공
  // LOADING : 데이터를 가져오는 중
  // ERROR : 데이터를 가져오는데 실패
  function reducer(state, action) {
    switch (action.type) {
      case SUCCESS:
        return { ...state, loading: false, user: action.user, repos: action.repos };
      case LOADING:
        return { ...state, loading: true, error: null };
      case ERROR:
        return { ...state, error: action.error, loading: false };
      default:
        throw new Error("에러");
    }
  }

  return (
    <div className="container">
      <Search getUser={getUser} />
      <h2>{state.user?.name} Git Hub</h2>
      {/* 현재 상태가 로딩중일 때 */}
      {state.loading && <p className="loading">로딩중...</p>}
      {/* 에러가 존재할 때 */}
      {state.error && <p className="error">{state.error}</p>}
      {!state.loading && !state.error && state.user && state.repos && (
        <>
          <div className="user">
            <img src={state.user.avatar_url} alt="" className="user_img" />
            <p className="user_txt">
              이름 : {state.user.name}
              <br />
              followers : {state.user.followers}, following : {state.user.following}
            </p>
          </div>

          <p>작업물.....</p>
          <ul>
            {state.repos.map((repos) => (
              <Repos repos={repos} key={repos.id} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
