/** @jsxImportSource @emotion/react */

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Theme, css, keyframes } from "@emotion/react";
import { UserAuthAPI } from "../../api/UserAuth";
import { PasswordChangeInputs } from "../../types/auth";

function ClearAdornment({ name, setValue }: { name: string; setValue: any }) {
  return (
    <InputAdornment position="end">
      <IconButton onClick={() => setValue(name, "")} edge="end" tabIndex={-1}>
        <HighlightOffIcon />
      </IconButton>
    </InputAdornment>
  );
}

const rules = {
  password: {
    required: "パスワードを入力してください",
    minLength: {
      value: 8,
      message: "パスワードは 8 文字以上 30 文字以内で入力してください",
    },
    maxLength: {
      value: 30,
      message: "パスワードは 8 文字以上 30 文字以内で入力してください",
    },
    pattern: {
      value: /^[a-zA-Z0-9._-]+$/,
      message: "使用できない文字が含まれています",
    },
  },
};

function Main() {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PasswordChangeInputs>();
  const navigate = useNavigate();

  const onSubmit = async (data: PasswordChangeInputs) => {
    try {
      await UserAuthAPI.changePassword(data);
      navigate("/password?complete");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} css={formStyle}>
        <h1>パスワード変更</h1>
        <div css={formInputStyle}>
          <Controller
            name="old_password"
            control={control}
            rules={rules.password}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="password"
                label="現在のパスワード"
                error={errors[field.name] ? true : false}
                helperText={(errors[field.name]?.message as string) || " "}
                InputProps={{
                  endAdornment: (
                    <ClearAdornment name={field.name} setValue={setValue} />
                  ),
                }}
              />
            )}
          />
        </div>
        <div css={formInputStyle}>
          <Controller
            name="new_password1"
            control={control}
            rules={rules.password}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="password"
                label="新しいパスワード"
                error={errors[field.name] ? true : false}
                helperText={(errors[field.name]?.message as string) || " "}
                InputProps={{
                  endAdornment: (
                    <ClearAdornment name={field.name} setValue={setValue} />
                  ),
                }}
              />
            )}
          />
        </div>
        <div css={formInputStyle}>
          <Controller
            name="new_password2"
            control={control}
            rules={{
              required: "確認用のパスワードを入力してください",
              validate: (input) => {
                if (input !== getValues("new_password1")) {
                  return "パスワードが一致していません";
                }
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="password"
                label="新しいパスワード(確認用)"
                error={errors[field.name] ? true : false}
                helperText={(errors[field.name]?.message as string) || " "}
                InputProps={{
                  endAdornment: (
                    <ClearAdornment name={field.name} setValue={setValue} />
                  ),
                }}
              />
            )}
          />
        </div>
        <button type="submit" css={okButtonStyle}>
          変更
        </button>
      </form>
      <div css={navigateLinkStyle}>
        <Link to={'.'} onClick={e => {
          e.preventDefault();
          navigate(-1);
        }}>戻る</Link>
      </div>
    </>
  );
}

function Complete() {
  const {
    handleSubmit,
  } = useForm<PasswordChangeInputs>();
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate(-2);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} css={formStyle}>
        <h1>パスワード変更</h1>
        <div>パスワードを変更しました。</div>
        <button type="submit" css={okButtonStyle}>
          戻る
        </button>
      </form>
    </>
  );
}

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams();

  let comp;
  if (searchParams.has("complete")) {
    comp = <Complete />;
  } else {
    comp = <Main />;
  }

  return (
    <Box css={backStyle}>
      <div css={containerStyle}>{comp}</div>
    </Box>
  );
}

const backStyle = (theme: Theme) => css`
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.palette.primary.main};
  background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 20%,
      ${theme.palette.primary.main} 100%
    ),
    url(${process.env.PUBLIC_URL + "/images/background.jpg"});
  background-position: center bottom;
  background-size: 400%;
  background-repeat: no-repeat;
`;

const containerStyle = css`
  width: 80%;
  max-width: 600px;
  text-align: center;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

const fadeUpAnime = keyframes`
  from {
    opacity: 0;
    transform: translateY(100px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const formStyle = css`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  width: 95%;
  padding: 10px;
  margin: 30px 0px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.3);
  animation: ${fadeUpAnime} 1s ease forwards;
  & h1 {
    font-size: 20pt;
    margin-bottom: 30px;
    margin-top: 60px;
  }
`;

const formInputStyle = css`
  margin: 5px;
  width: 90%;
  max-width: 300px;
  div {
    color: #000;
  }
`;

const okButtonStyle = (theme: Theme) => css`
  background-color: ${theme.palette.primary.main};
  color: white;
  border-radius: 40px;
  border: none;
  width: 120px;
  height: 45px;
  margin: 30px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  font-size: 12pt;
  font-weight: 300;
  &:hover {
    background-color: ${theme.palette.primary.light};
  }
`;

const navigateLinkStyle = (theme: Theme) => css`
  padding-bottom: 20px;
  & * {
    display: block;
    color: ${theme.palette.primary.contrastText};
    margin: 20px 0;
  }
`;
