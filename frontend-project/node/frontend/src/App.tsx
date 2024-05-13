import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="post" element={<PostPage />} />
        <Route path="post_detail/:id/" element={<PostDetailPage />} />
        <Route path="user_profile/:id/" element={<Outlet />}>
          <Route path="" element={<UserProfilePage />} />
          <Route path="edit/" element={
            <PostListProvider>
              <UserProfileEditPage />
            </PostListProvider>
          } />
          <Route path="followee/" element={<FollowUserListPage />} />
          <Route path="follower/" element={<FollowerListPage />} />
        </Route>
        <Route path="user_tanka/:userId/" element={<UserTankaPage />} />
        <Route path="favorite/:userId/" element={<FavoritesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
