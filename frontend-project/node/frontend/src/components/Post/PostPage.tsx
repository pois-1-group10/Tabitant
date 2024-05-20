/** @jsxImportSource @emotion/react */

import React, { useContext, useEffect, useState } from "react";
import { css } from "@emotion/react";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import Card from "../common/Card";
import TagChoices from "./TagChoices";
import BackButton from "../common/BackButton";
import { Controller, useForm } from "react-hook-form";
import { Switch, TextField } from "@mui/material";
import { AuthUserContext } from "../../providers/AuthUserProvider";
import { convertToHiragana } from "../../utils/tanka";
import { PostAPI } from "../../api/Post";
import { useNavigate } from "react-router-dom";
import { DetailedPlaceContext } from "../../providers/DetailedPlaceProvider";

type Input = {
  prefecture: string | null;
  tanka1: string;
  tanka2: string;
  tanka3: string;
  tanka4: string;
  tanka5: string;
  hiragana1: string;
  hiragana2: string;
  hiragana3: string;
  hiragana4: string;
  hiragana5: string;
};

export default function PostPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [detailedPlaceIsOn, setDetailedPlaceIsOn] = useState<boolean>(true);
  const [kanji1Length, setKanji1Length] = useState<number>(160);
  const [kanji2Length, setKanji2Length] = useState<number>(264);
  const [kanji3Length, setKanji3Length] = useState<number>(160);
  const [kanji4Length, setKanji4Length] = useState<number>(264);
  const [kanji5Length, setKanji5Length] = useState<number>(264);
  const [hiragana1Length, setHiragana1Length] = useState<number>(160);
  const [hiragana2Length, setHiragana2Length] = useState<number>(264);
  const [hiragana3Length, setHiragana3Length] = useState<number>(160);
  const [hiragana4Length, setHiragana4Length] = useState<number>(264);
  const [hiragana5Length, setHiragana5Length] = useState<number>(264);
  const [placeIndex, setPlaceIndex] = useState<number>(0);

  const { currentUser } = useContext(AuthUserContext);
  const { places, loading, lat, lng, setLat, setLng } =
    useContext(DetailedPlaceContext);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Input>();
  const navigate = useNavigate();

  const fetchCurrentRegion = () =>
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);
        setPlaceIndex(0);
        // Google Maps Geocoding APIを使用して緯度経度から住所を取得
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_API_KEY}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // 県名を抽出
            const addressComponents = data.results[0].address_components;
            const province = addressComponents.find((component: any) =>
              component.types.includes("administrative_area_level_1")
            ).long_name;

            // stateを更新して再レンダリング
            setValue("prefecture", province);
          })
          .catch((error) => setValue("prefecture", null));
      },
      (error) => {
        setLat(null);
        setLng(null);
        setValue("prefecture", null);
      }
    );

  const onChange1 = async (e: any) => {
    const tanka1 = e.target.value;
    setValue("tanka1", tanka1);
    setKanji1Length(Math.max(32 * tanka1.length, 160));
    const hiragana1 = await convertToHiragana(tanka1);
    setHiragana1Length(Math.max(32 * hiragana1.length, 160));
    setValue("hiragana1", hiragana1);
  };

  const onChange2 = async (e: any) => {
    const tanka2 = e.target.value;
    setValue("tanka2", tanka2);
    setKanji2Length(Math.max(32 * tanka2.length, 280));
    const hiragana2 = await convertToHiragana(tanka2);
    setHiragana2Length(Math.max(32 * hiragana2.length, 280));
    setValue("hiragana2", hiragana2);
  };

  const onChange3 = async (e: any) => {
    const tanka3 = e.target.value;
    setValue("tanka3", tanka3);
    setKanji3Length(Math.max(32 * tanka3.length, 160));
    const hiragana3 = await convertToHiragana(tanka3);
    setHiragana3Length(Math.max(32 * hiragana3.length, 160));
    setValue("hiragana3", hiragana3);
  };

  const onChange4 = async (e: any) => {
    const tanka4 = e.target.value;
    setValue("tanka4", tanka4);
    setKanji4Length(Math.max(32 * tanka4.length, 280));
    const hiragana4 = await convertToHiragana(tanka4);
    setHiragana4Length(Math.max(32 * hiragana4.length, 280));
    setValue("hiragana4", hiragana4);
  };

  const onChange5 = async (e: any) => {
    const tanka5 = e.target.value;
    setValue("tanka5", tanka5);
    setKanji5Length(Math.max(32 * tanka5.length, 280));
    const hiragana5 = await convertToHiragana(tanka5);
    setHiragana5Length(Math.max(32 * hiragana5.length, 280));
    setValue("hiragana5", hiragana5);
  };

  const onChangeHiragana1 = async (e: any) => {
    const hiragana1 = e.target.value;
    setHiragana1Length(Math.max(32 * hiragana1.length, 160));
    setValue("hiragana1", hiragana1);
  };

  const onChangeHiragana2 = async (e: any) => {
    const hiragana2 = e.target.value;
    setHiragana2Length(Math.max(32 * hiragana2.length, 280));
    setValue("hiragana2", hiragana2);
  };

  const onChangeHiragana3 = async (e: any) => {
    const hiragana3 = e.target.value;
    setHiragana3Length(Math.max(32 * hiragana3.length, 160));
    setValue("hiragana3", hiragana3);
  };

  const onChangeHiragana4 = async (e: any) => {
    const hiragana4 = e.target.value;
    setHiragana4Length(Math.max(32 * hiragana4.length, 280));
    setValue("hiragana4", hiragana4);
  };

  const onChangeHiragana5 = async (e: any) => {
    const hiragana5 = e.target.value;
    setHiragana5Length(Math.max(32 * hiragana5.length, 280));
    setValue("hiragana5", hiragana5);
  };

  const onSubmit = async (data: Input) => {
    const detailPos = detailedPlaceIsOn
      ? {
          latitude: lat ?? undefined,
          longitude: lng ?? undefined,
        }
      : {};
    await PostAPI.createPost({
      user: currentUser?.id,
      tag_list: selectedTags,
      content_1: data.tanka1,
      content_2: data.tanka2,
      content_3: data.tanka3,
      content_4: data.tanka4,
      content_5: data.tanka5,
      hiragana_1: data.hiragana1,
      hiragana_2: data.hiragana2,
      hiragana_3: data.hiragana3,
      hiragana_4: data.hiragana4,
      hiragana_5: data.hiragana5,
      prefecture: data.prefecture,
      detailed_place: places[placeIndex].name,
      ...detailPos,
    });
    navigate("/");
  };

  useEffect(() => {
    fetchCurrentRegion();
  }, []);

  const tankaInputStyle = css`
    writing-mode: vertical-rl;
    margin: 0 -8px;
    input {
      font-size: 22px;
      letter-spacing: 8px;
      height: 100%;
      padding: 0 16px;
    }
    fieldset {
      border: none;
      border-left: 1px solid #767878;
      border-radius: 0;
      padding: 0;
    }
    p {
      margin: 0;
    }
  `;

  return (
    <div css={backgroundStyle}>
      <BackButton />
      <form css={formStyle} onSubmit={handleSubmit(onSubmit)}>
        <Card style={postCardStyle}>
          <div css={postCardHeaderStyle}>
            <img src={currentUser?.image} alt="icon" css={iconStyle} />
            <div css={postCardHeaderContentStyle}>
              <TagChoices
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
              />
              <div css={switchWrappingFlexbox}>
                <div css={areaPositionWrapperStyle}>
                  <div css={areaPositionTextStyle}>
                    <div className="area">
                      {watch("prefecture") !== null
                        ? watch("prefecture")
                        : "位置情報取得エラー"}
                    </div>
                    {detailedPlaceIsOn &&
                      lat !== undefined &&
                      lng !== undefined && (
                        <div className="position">
                          {!loading &&
                            (places.length > 0 ? (
                              <div css={detailPlaceWrapperStyle}>
                                <span>{places[placeIndex].name}</span>
                                <ChangeCircleIcon
                                  css={changeCircleIconStyle}
                                  onClick={() =>
                                    setPlaceIndex(
                                      (i) => (i + 1) % places.length
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              "詳細位置取得エラー"
                            ))}
                        </div>
                      )}
                  </div>
                </div>
                <div css={detailedPlaceSwitchWrapperStyle}>
                  <Switch
                    checked={detailedPlaceIsOn}
                    onChange={() => setDetailedPlaceIsOn((v) => !v)}
                  />
                  <div>詳細位置on</div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div css={tankaContentWrapperStyle}>
            <Controller
              name="tanka1"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  css={tankaInputStyle}
                  style={{ height: `${kanji1Length}px` }}
                  onChange={onChange1}
                  error={errors[field.name] ? true : false}
                  helperText={(errors[field.name]?.message as string) || " "}
                />
              )}
            />
            <Controller
              name="tanka2"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  css={tankaInputStyle}
                  style={{ height: `${kanji2Length}px` }}
                  onChange={onChange2}
                  error={errors[field.name] ? true : false}
                  helperText={(errors[field.name]?.message as string) || " "}
                />
              )}
            />
            <Controller
              name="tanka3"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  css={tankaInputStyle}
                  style={{ height: `${kanji3Length}px` }}
                  onChange={onChange3}
                  error={errors[field.name] ? true : false}
                  helperText={(errors[field.name]?.message as string) || " "}
                />
              )}
            />
            <Controller
              name="tanka4"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  css={tankaInputStyle}
                  style={{ height: `${kanji4Length}px` }}
                  onChange={onChange4}
                  error={errors[field.name] ? true : false}
                  helperText={(errors[field.name]?.message as string) || " "}
                />
              )}
            />
            <Controller
              name="tanka5"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  css={tankaInputStyle}
                  style={{ height: `${kanji5Length}px` }}
                  onChange={onChange5}
                  error={errors[field.name] ? true : false}
                  helperText={(errors[field.name]?.message as string) || " "}
                />
              )}
            />
          </div>
        </Card>
        <Card style={postCardStyle}>
          <p css={hiraganaTitleStyle}>ひらがな入力</p>
          <hr />
          <div css={tankaContentWrapperStyle}>
            <Controller
              name="hiragana1"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  css={tankaInputStyle}
                  style={{ height: `${hiragana1Length}px` }}
                  onChange={onChangeHiragana1}
                  error={errors[field.name] ? true : false}
                  helperText={(errors[field.name]?.message as string) || " "}
                />
              )}
            />
            <Controller
              name="hiragana2"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  css={tankaInputStyle}
                  style={{ height: `${hiragana2Length}px` }}
                  onChange={onChangeHiragana2}
                  error={errors[field.name] ? true : false}
                  helperText={(errors[field.name]?.message as string) || " "}
                />
              )}
            />
            <Controller
              name="hiragana3"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  css={tankaInputStyle}
                  style={{ height: `${hiragana3Length}px` }}
                  onChange={onChangeHiragana3}
                  error={errors[field.name] ? true : false}
                  helperText={(errors[field.name]?.message as string) || " "}
                />
              )}
            />
            <Controller
              name="hiragana4"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  css={tankaInputStyle}
                  style={{ height: `${hiragana4Length}px` }}
                  onChange={onChangeHiragana4}
                  error={errors[field.name] ? true : false}
                  helperText={(errors[field.name]?.message as string) || " "}
                />
              )}
            />
            <Controller
              name="hiragana5"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  css={tankaInputStyle}
                  style={{ height: `${hiragana5Length}px` }}
                  onChange={onChangeHiragana5}
                  error={errors[field.name] ? true : false}
                  helperText={(errors[field.name]?.message as string) || " "}
                />
              )}
            />
          </div>
        </Card>
        <button type="submit" css={postButtonStyle}>
          詠む
        </button>
      </form>
    </div>
  );
}

const backgroundStyle = css`
  background: linear-gradient(to bottom, #ffffff, #ff981f 50%);
  padding: 24px;
  height: calc(100vh - 48px);
  width: calc(100vw - 48px);
  overflow: scroll;
`;

const formStyle = css`
  & > div:first-of-type {
    margin-top: 60px;
  }
  & > div:last-of-type {
    margin-top: 24px;
    margin-bottom: 48px;
  }
`;

const postCardStyle = css`
  width: 100%;
`;

const postCardHeaderStyle = css`
  width: 100%;
  display: flex;
  gap: 4px;
`;

const iconStyle = css`
  height: 32px;
  width: 32px;
  border-radius: 16px;
  border: 1px solid #303030;
  flex-shrink: 0;
`;

const switchWrappingFlexbox = css`
  display: flex;
  gap: 4px;
`;

const detailedPlaceSwitchWrapperStyle = css`
  width: fit-content;
  flex-shrink: 0;
  font-size: 12px;
`;

const postCardHeaderContentStyle = css`
  position: relative;
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  gap: 8px;
  max-width: calc(100% - 40px);
`;

const tankaContentWrapperStyle = css`
  display: flex;
  flex-direction: row-reverse;
  width: 90%;
  height: fit-content;
  margin: 24px 5%;
`;

const areaPositionWrapperStyle = css`
  width: 0;
  flex-basis: 0;
  flex-shrink: 1;
  flex-grow: 1;
`;

const areaPositionTextStyle = css`
  width: 100%;
  text-align: left;
  .area {
    font-size: 24px;
    font-weight: bold;
  }
  .position {
    font-size: 14px;
  }
`;

const hiraganaTitleStyle = css`
  color: #999;
  font-size: 24px;
  margin: 0;
`;

const postButtonStyle = css`
  display: block;
  outline: none;
  appearance: none;
  position: fixed;
  bottom: 24px;
  right: 24px;
  margin: 0 8px 8px auto;
  height: 48px;
  width: 104px;
  background-color: #ff981f;
  border: 1px solid #fff;
  border-radius: 30px;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.5);
  color: #fff;
`;

const detailPlaceWrapperStyle = css`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 20px;
  span {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const changeCircleIconStyle = css`
  height: 20px;
  width: 20px;
`;
