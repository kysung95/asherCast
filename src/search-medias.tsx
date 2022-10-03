import { Detail, getPreferenceValues, popToRoot, showToast, Toast } from "@raycast/api";
import fetch from "node-fetch";
import React from "react";
import { fetchMedias } from "./api";
import { WistiaMedia, WistiaApiError, Preferences } from "./types";

export default function SearchMedias() {
  const preferences: Preferences = getPreferenceValues();
  const password = preferences.wistiaApiToken;

  const [medias, setMedias] = React.useState<WistiaMedia[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const medias = await fetchMedias();
        setMedias(medias);
        console.log(medias);
      } catch (e) {
        if ((e as WistiaApiError)?.code === "unauthorized_credentials") {
          showToast(Toast.Style.Failure, "API 토큰 값이 유효하지 않습니다. ", "다시 한 번 확인해주세요.");
          popToRoot();
        } else {
          showToast(Toast.Style.Failure, "데이터를 받아오는데에 실패하였습니다.", "잠시 후 다시 시도해주세요.");
        }
        console.error(e);
      }
    }

    fetchData();
  }, []);

  return <Detail />;
}
