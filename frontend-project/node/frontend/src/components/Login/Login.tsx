import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import axios from 'axios';
import './Login.css'

type SigninInputs = {
  email: string;
  password: string;
}

type SignupInputs = {
  email: string;
  name: string;
  password: string;
  password_confirm: string;
}

function ClearAdornment({ name, setValue }: { name: string, setValue: any }) {
  return (
    <InputAdornment position="end">
      <IconButton
        onClick={() => setValue(name, '')}
        edge="end"
      >
        <HighlightOffIcon />
      </IconButton>
    </InputAdornment>
  );
}

const rules = {
  'email': {
    required: 'メールアドレスを入力してください',
    maxLength: {
      value: 254,
      message: 'メールアドレスが長すぎます'
    },
    pattern: {
      value: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      message: 'メールアドレスの形式が不正です',
    }
  },
  'password': {
    required: 'パスワードを入力してください',
    minLength: {
      value: 8,
      message: 'パスワードは 8 文字以上 30 文字以内で入力してください'
    },
    maxLength: {
      value: 30,
      message: 'パスワードは 8 文字以上 30 文字以内で入力してください'
    },
    pattern: {
      value: /^[a-zA-Z0-9._-]+$/,
      message: '使用できない文字が含まれています',
    }
  },
  'name': {
    required: 'ニックネームを入力してください',
    maxLength: {
      value: 20,
      message: '20 文字以内で入力してください'
    }
  },
}

function Signin() {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<SigninInputs>();
  const navigate = useNavigate();

  const onSubmit = (data: SigninInputs) => {
    console.log(data);
  }

  return (
    <>
      <form className='loginForm' onSubmit={handleSubmit(onSubmit)}>
        <h1>ログイン</h1>
        <div className='formInput'>
          <Controller name='email' control={control} rules={rules.email} render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label='メールアドレス'
              placeholder='email@example.com'
              error={errors[field.name] ? true : false}
              helperText={errors[field.name]?.message as string || " "}
              InputProps={{
                endAdornment:
                  <ClearAdornment name={field.name} setValue={setValue} />
              }}
            />
          )} />
        </div>
        <div className='formInput'>
          <Controller name='password' control={control} rules={rules.password} render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type='password'
              label='パスワード'
              error={errors[field.name] ? true : false}
              helperText={errors[field.name]?.message as string || " "}
              InputProps={{
                endAdornment:
                  <ClearAdornment name={field.name} setValue={setValue} />
              }}
            />
          )} />
        </div>
        <button type='submit' className='okButton'>ログイン</button>
      </form>
      <div className='navigateLinks'>
        <Link to='/Login?signup'>新規登録</Link>
        <Link to='/Login?reset'>パスワードを忘れた方はこちら</Link>
      </div>
    </>
  )
}

function Signup() {
  const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm<SignupInputs>();
  const navigate = useNavigate();

  const onSubmit = (data: SigninInputs) => {
    console.log(data);
  }

  return (
    <>
      <form className='loginForm' onSubmit={handleSubmit(onSubmit)}>
        <h1>新規登録</h1>
        <div className='formInput'>
          <Controller name='email' control={control} rules={rules.email} render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label='メールアドレス'
              placeholder='email@example.com'
              error={errors[field.name] ? true : false}
              helperText={errors[field.name]?.message as string || " "}
              InputProps={{
                endAdornment:
                  <ClearAdornment name={field.name} setValue={setValue} />
              }}
            />
          )} />
        </div>
        <div className='formInput'>
          <Controller name='name' control={control} rules={rules.name} render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label='ニックネーム'
              error={errors[field.name] ? true : false}
              helperText={errors[field.name]?.message as string || " "}
              InputProps={{
                endAdornment:
                  <ClearAdornment name={field.name} setValue={setValue} />
              }}
            />
          )} />
        </div>
        <div className='formInput'>
          <Controller name='password' control={control} rules={rules.password} render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type='password'
              label='パスワード'
              error={errors[field.name] ? true : false}
              helperText={errors[field.name]?.message as string || " "}
              InputProps={{
                endAdornment:
                  <ClearAdornment name={field.name} setValue={setValue} />
              }}
            />
          )} />
        </div>
        <div className='formInput'>
          <Controller name='password_confirm' control={control} rules={{
            required: '確認用のパスワードを入力してください',
            validate: (input) => {
              if (input !== getValues('password')) {
                return 'パスワードが一致していません';
              }
            }
          }} render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              type='password'
              label='パスワード(確認用)'
              error={errors[field.name] ? true : false}
              helperText={errors[field.name]?.message as string || " "}
              InputProps={{
                endAdornment:
                  <ClearAdornment name={field.name} setValue={setValue} />
              }}
            />
          )} />
        </div>
        <button type='submit' className='okButton'>登録</button>
      </form>
      <div className='navigateLinks'>
        <Link to='/Login?signin'>ログイン</Link>
      </div>
    </>
  )
}

// パスワードリセット
function Reset() {
  return (
    <>
    </>
  )
}

// ログイン / 新規登録
function Select() {
  return (
    <div className='selectLinks'>
      <Link className='selectLoginLink' to='/Login?signin'>ログイン</Link>
      <Link to='/Login?signup'>新規登録</Link>
    </div>
  )
}

export default function Login() {
  const [searchParams] = useSearchParams();

  let comp;
  if (searchParams.has('signin')) {
    comp = <Signin />;
  } else if (searchParams.has('signup')) {
    comp = <Signup />;
  } else if (searchParams.has('reset')) {
    comp = <Reset />;
  } else {
    comp = <Select />;
  }

  return comp;
}