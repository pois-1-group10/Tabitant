import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import PostPage from "./components/Post/PostPage";
import PostDetailPage from "./components/PostDetail/PostDetailPage";
import UserProfilePage from "./components/UserProfile/UserProfilePage";
import UserTankaPage from "./components/UserTanka/UserTankaPage";
import FavoritesPage from "./components/Favorites/FavoritesPage";
import FollowUserListPage from "./components/UserProfile/FollowUserListPage";
import FollowerListPage from "./components/UserProfile/FollowerListPage";
import UserProfileEditPage from "./components/UserProfile/UserProfileEditPage";
import { PostListProvider } from "./providers/PostListProvider";
import RankingPage from "./components/Ranking/RankingPage";
import { UserListProvider } from "./providers/UserListProvider";
import { UserDetailProvider } from "./providers/UserDetailProvider";
import { AuthUserProvider } from "./providers/AuthUserProvider";
import { PostDetailProvider } from "./providers/PostDetailProvider";
import { CommentListProvider } from "./providers/CommentListProvider";
import PasswordPage from "./components/Password/PasswordPage";
import { MapLocationProvider } from "./providers/MapLocationProvider";
import { DetailedPlaceProvider } from "./providers/DetailedPlaceProvider";
import { CompetitionListProvider } from "./providers/CompetitionListProvider";

function App() {
  const RequireAuth = (props: { children: React.ReactElement }) => {
    const token = sessionStorage.getItem("token");

    // 権限が「GENERAL」の場合、渡されたコンポーネントをレンダリング
    if (token) {
      return props.children;
    }

    // 権限がない場合、ログインページへリダイレクト
    document.location = "/login";
    return <></>;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <AuthUserProvider>
              <MapLocationProvider>
                <PostListProvider>
                  <PostDetailProvider>
                    <Home />
                  </PostDetailProvider>
                </PostListProvider>
              </MapLocationProvider>
            </AuthUserProvider>
          }
        />
        <Route path="login" element={<Login />} />
        <Route
          path="/"
          element={
            // sessionStorage.getItem("token") ? (
            //   <AuthUserProvider>
            //     <Outlet />
            //   </AuthUserProvider>
            // ) : (
            //   <Navigate replace to="/login/" />
            // )
            <RequireAuth>
              <AuthUserProvider>
                <Outlet />
              </AuthUserProvider>
            </RequireAuth>
          }
        >
          <Route
            path="post"
            element={
              <DetailedPlaceProvider>
                <PostPage />
              </DetailedPlaceProvider>
            }
          />
          <Route
            path="post_detail/:id/"
            element={
              <PostDetailProvider>
                <CommentListProvider>
                  <PostDetailPage />
                </CommentListProvider>
              </PostDetailProvider>
            }
          />
          <Route path="user_profile/:id/" element={<Outlet />}>
            <Route
              path=""
              element={
                <UserDetailProvider>
                  <UserProfilePage />
                </UserDetailProvider>
              }
            />
            <Route
              path="edit/"
              element={
                <UserDetailProvider>
                  <PostListProvider>
                    <UserProfileEditPage />
                  </PostListProvider>
                </UserDetailProvider>
              }
            />
            <Route
              path="followee/"
              element={
                <UserListProvider>
                  <FollowUserListPage />
                </UserListProvider>
              }
            />
            <Route
              path="follower/"
              element={
                <UserListProvider>
                  <FollowerListPage />
                </UserListProvider>
              }
            />
          </Route>
          <Route
            path="user_tanka/:userId/"
            element={
              <PostListProvider>
                <UserTankaPage />
              </PostListProvider>
            }
          />
          <Route
            path="favorite/:userId/"
            element={
              <PostListProvider>
                <FavoritesPage />
              </PostListProvider>
            }
          />
          <Route
            path="ranking"
            element={
              <PostListProvider>
                <CompetitionListProvider>
                  <RankingPage />
                </CompetitionListProvider>
              </PostListProvider>
            }
          />
          <Route path="password" element={<PasswordPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
