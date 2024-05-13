/** @jsxImportSource @emotion/react */

import imageCompression from "browser-image-compression";
import React, { useState } from "react";
import { css } from "@emotion/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TextField } from "@mui/material";

import BackButton from "../common/BackButton";
import Card from "../common/Card";
import CheckButton from "../common/CheckButton";
import EditButton from "../common/EditButton";
import { useNavigate, useParams } from "react-router-dom";

type Input = {
  username?: string;
  bio?: string;
  tankaId: string;
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({
    defaultValues: {
      username: "ユーザー　ネーム",
      bio: "",
    },
  });
	const navigate = useNavigate();
	const params = useParams();
	const id = params.id;

  const onSubmit: SubmitHandler<Input> = (data) => {
    const formData = new FormData();
    formData.append("username", data.username ?? "");
    formData.append("bio", data.bio ?? "");
    photo && formData.append("icon", photo);
    console.log(formData.get("icon"));
		navigate(`/user_profile/${id}/`);
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

  return (
    <div css={backgroundStyle}>
			<BackButton />
			<CheckButton style={submitButtonStyle} onClick={handleSubmit(onSubmit)} />
      <div css={imagePreviewStyle}>
        <EditButton
          style={editButtonStyle}
          onClick={() => document.getElementById("upload-button")?.click()}
        />
        {photo && (
          <img
            src={URL.createObjectURL(photo)}
            alt="アイコン写真"
            css={imageStyle}
          />
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
        </form>
      </Card>
    </div>
  );
}

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
`;

const imageStyle = css`
  height: 280px;
  width: 280px;
  border: 1px solid #303030;
  border-radius: 156px;
  object-fit: cover;
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
