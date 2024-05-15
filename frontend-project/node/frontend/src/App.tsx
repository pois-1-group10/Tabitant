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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <AuthUserProvider>
              <Home />
            </AuthUserProvider>
          }
        />
        <Route path="login" element={<Login />} />
        <Route
          path="/"
          element={
            sessionStorage.getItem("token") ? (
              <AuthUserProvider>
                <Outlet />
              </AuthUserProvider>
            ) : (
              <Navigate replace to="/login/" />
            )
          }
        >
          <Route path="post" element={<PostPage />} />
          <Route path="post_detail/:id/" element={<PostDetailPage />} />
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
                <PostListProvider>
                  <UserProfileEditPage />
                </PostListProvider>
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
          <Route path="user_tanka/:userId/" element={<UserTankaPage />} />
          <Route path="favorite/:userId/" element={<FavoritesPage />} />
          <Route path="ranking" element={<RankingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
