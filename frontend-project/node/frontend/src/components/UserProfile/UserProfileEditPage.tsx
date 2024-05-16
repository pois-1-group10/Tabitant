/** @jsxImportSource @emotion/react */

import imageCompression from "browser-image-compression";
import React, { FC, useContext, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TextField } from "@mui/material";

import BackButton from "../common/BackButton";
import Card from "../common/Card";
import CheckButton from "../common/CheckButton";
import EditButton from "../common/EditButton";
import { useNavigate, useParams } from "react-router-dom";
import { PostListContext } from "../../providers/PostListProvider";
import { Post } from "../../types/post";
import { UserDetailContext } from "../../providers/UserDetailProvider";
import { AuthUserContext } from "../../providers/AuthUserProvider";
import { UserAPI } from "../../api/User";

type Input = {
  username?: string;
  bio?: string;
  tankaId: number;
};

const rules = {
  username: {
    required: "ニックネームを入力してください",
    maxLength: {
      value: 20,
      message: "20 文字以内で入力してください",
    },
  },
  bio: {
    maxLength: {
      value: 100,
      message: "100 文字以内で入力してください",
    },
    validate: (value?: string) =>
      (value?.split("\n").length ?? 0) <= 3 || "3行以内で記述してください",
  },
};

export default function UserProfileEditPage() {
  const [photo, setPhoto] = useState<File>();
  const [selectingPost, setSelectingPost] = useState<Post>();
  const { posts, fetchPosts } = useContext(PostListContext);
  const { user, fetchUserDetail } = useContext(UserDetailContext);
  const { currentUser } = useContext(AuthUserContext);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Input>({
    defaultValues: {
      username: user?.username,
      bio: user?.userprofile?.bio,
    },
  });

  const navigate = useNavigate();
  const params = useParams();
  const userId = Number(params.id);

  const onSubmit: SubmitHandler<Input> = async (data) => {
    if (currentUser) {
      const userData = new FormData();
      userData.append("username", data.username ?? "");
      photo && userData.append("image", photo, photo.name);
      await UserAPI.editUserProfile(currentUser.id, {
        default_post: selectingPost?.id ?? null,
        ...data,
      });
      await UserAPI.editUser(currentUser.id, userData);
      navigate(`/user_profile/${userId}/`);
    }
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    // 初期化することで同じファイルを連続で選択してもonChageが発動するように設定し、画像をキャンセルしてすぐに同じ画像を選ぶ動作に対応
    event.target.value = "";
    const compressedFile = await imageCompression(file, {
      maxWidthOrHeight: 560,
    });
    console.log("compressed file size: " + compressedFile.size.toString());
    setPhoto(compressedFile);
  };

  useEffect(() => {
    currentUser && fetchUserDetail(currentUser.id);
    currentUser && fetchPosts({ user_id: currentUser.id });
  }, []);

  useEffect(() => {
    user && setValue("username", user.username);
    user?.userprofile && setValue("bio", user.userprofile.bio);
    user?.userprofile?.default_post && setValue("tankaId", user.userprofile.default_post.id);
    user?.userprofile && setSelectingPost(user?.userprofile.default_post)
  }, [user]);

  return (
    <div css={backgroundStyle}>
      <BackButton />
      <CheckButton style={submitButtonStyle} onClick={handleSubmit(onSubmit)} />
      <div css={imagePreviewStyle}>
        <EditButton
          style={editButtonStyle}
          onClick={() => document.getElementById("upload-button")?.click()}
        />
        {photo ? (
          <div css={imageStyle}>
            <img src={URL.createObjectURL(photo)} alt="アイコン写真" />
          </div>
        ) : (
          <div css={imageStyle}>
            <img src={user?.image} alt="アイコン写真" />
          </div>
        )}
      </div>
      <Card style={cardStyle}>
        <div css={cardTitleStyle}>プロフィール情報</div>
        <form>
          <input
            id="upload-button"
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: "none" }} // ボタンを非表示にして、ラベルを使ってクリックできるようにする
          />
          <Controller
            name="username"
            control={control}
            rules={rules.username}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="ニックネーム"
                error={errors[field.name] ? true : false}
                helperText={(errors[field.name]?.message as string) || " "}
              />
            )}
          />
          <Controller
            name="bio"
            control={control}
            rules={rules.bio}
            render={({ field }) => (
              <TextField
                {...field}
                css={textareaStyle}
                label="自己紹介文"
                multiline
                error={errors[field.name] ? true : false}
                minRows={3}
                maxRows={3}
                helperText={(errors[field.name]?.message as string) || " "}
              />
            )}
          />
          <div css={tankaLabelStyle}>短歌選択</div>
          {selectingPost ? (
            <div css={selectingTankaStyle}>
              {selectingPost.content_1 +
                " " +
                selectingPost.content_2 +
                " " +
                selectingPost.content_3 +
                " " +
                selectingPost.content_4 +
                " " +
                selectingPost.content_5}
            </div>
          ) : (
            <div css={selectingTankaStyle}>未選択</div>
          )}
          <div css={tankaListWrapperStyle}>
            {posts.map((post) => (
              <SelectTankaItem
                key={post.id}
                post={post}
                isSelected={post.id === selectingPost?.id}
                setPost={setSelectingPost}
              />
            ))}
          </div>
        </form>
      </Card>
    </div>
  );
}

type TankaItemProps = {
  post: Post;
  isSelected: boolean;
  setPost: React.Dispatch<React.SetStateAction<Post | undefined>>;
};

const SelectTankaItem: FC<TankaItemProps> = (params: TankaItemProps) => {
  const { post, isSelected, setPost } = params;
  const tankaItemStyle = css`
    padding: 8px;
    font-size: 14px;
    background-color: ${isSelected ? "rgba(255, 152, 31, 0.5)" : "initial"};
  `;

  const postTimeStyle = css`
    font-size: 10px;
    color: #767878;
  `;

  const clickHandler = () => {
    if (isSelected) {
      setPost(undefined);
    } else {
      setPost(post);
    }
  };

  return (
    <div css={tankaItemStyle} onClick={clickHandler}>
      <div>
        {post.content_1 +
          " " +
          post.content_2 +
          " " +
          post.content_3 +
          " " +
          post.content_4 +
          " " +
          post.content_5}
      </div>
      <div css={postTimeStyle}>{post.created_at.toLocaleString()}</div>
    </div>
  );
};

const backgroundStyle = css`
  display: flex;
  flex-flow: column;
  gap: 16px;
  background: linear-gradient(to bottom, #ffffff, #ff981f 50%);
  padding: 24px;
  height: calc(100vh - 48px);
  width: calc(100vw - 48px);
  overflow: scroll;
`;

const submitButtonStyle = css`
  left: initial;
  right: 20px;
`;

const imagePreviewStyle = css`
  position: relative;
  margin: 60px auto 16px;
  height: 280px;
  width: 280px;
  border: 1px solid #303030;
  border-radius: 156px;
  background-color: #fff;
  flex-shrink: 0;
`;

const imageStyle = css`
  height: 280px;
  width: 280px;
  border-radius: 156px;
  overflow: hidden;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

const editButtonStyle = css`
  position: absolute;
  top: initial;
  left: initial;
  bottom: 16px;
  right: 16px;
  height: 64px;
  width: 64px;
  border-radius: 32px;
`;

const cardStyle = css`
  width: 100%;
  padding: 16px 8px;
`;

const cardTitleStyle = css`
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const textareaStyle = css`
  margin-top: 16px;
  width: 100%;
`;

const tankaLabelStyle = css`
  margin-top: 16px;
  font-size: 12px;
  color: #767878;
`;

const selectingTankaStyle = css`
  margin: 4px 4px 16px;
  font-size: 16px;
  font-weight: bold;
`;

const tankaListWrapperStyle = css`
  max-height: 240px;
  width: 98%;
  margin: 8px auto;
  border-radius: 8px;
  border: 1px solid #767878;
  overflow: scroll;
`;
