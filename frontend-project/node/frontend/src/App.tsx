import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import PostPage from "./components/Post/PostPage";
import PostDetailPage from "./components/PostDetail/PostDetailPage";
import UserProfilePage from "./components/UserProfile/UserProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="post" element={<PostPage />} />
        <Route path="post_detail/:id" element={<PostDetailPage />} />
        <Route path="user_profile/:id" element={<UserProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
