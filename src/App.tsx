import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppWrapper from "./components/AppWrapper";
import Login from "./components/LoginAndAuth/Login";
import { useEffect, useState } from "react";
import { useContextValue } from "./utils/ContextProvider";
import { reducerCases } from "./utils/Constants";
import axios from "axios";

export default function App() {
  const [{ token }, dispatch] = useContextValue();
  const [accessToken, setAccessToken] = useState<string | null>();
  const [refreshToken, setRefreshToken] = useState<string | null>();
  const [, setExpiresIn] = useState<number | null>();

  useEffect(() => {
    const getTokenFunction = async () => {
      axios
        .get("https://tunestellar-api.onrender.com/auth/getTokens")
        .then((response) => {
          if (
            response.data.access_token !== "" &&
            response.data.expires_in !== "" &&
            response.data.refresh_token !== ""
          ) {
            handleTokenResponse(response.data);
          } else {
            console.log("Failed to retrieve tokens: " + response.statusText);
          }
        })
        .catch((error) => {
          console.log(`Error getting access token ${error}`);
        });
    };

    getTokenFunction();
  }, []);

  const handleTokenResponse = (responseData: any) => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("expires_in");
    const refreshToken =
      responseData?.refresh_token || localStorage.getItem("refresh_token");
    setAccessToken(responseData.access_token);
    setExpiresIn(responseData.expires_in);

    if (refreshToken === localStorage.getItem("refresh_token")) {
      setRefreshToken(refreshToken);
    } else {
      localStorage.removeItem("refresh_token");
      setRefreshToken(refreshToken);
      localStorage.setItem("refresh_token", responseData?.refresh_token);
    }
    localStorage.setItem("access_token", responseData?.access_token);
    localStorage.setItem("expires_in", responseData?.expires_in.toString());

    const currentCheckTime = Date.now();
    if (
      Number(localStorage.getItem("expireTime")) <= currentCheckTime ||
      !localStorage.getItem("expireTime")
    ) {
      const expiresInMS = responseData.expires_in * 1000;
      const currentTime = Date.now();
      const expireTime = currentTime + expiresInMS;
      localStorage.setItem("expireTime", expireTime.toString());
    }

    // console.log(`Access token: ${responseData.access_token},
    // RefreshToken: ${refreshToken},
    // expireIn: ${responseData.expires_in}
    // expireTime: ${localStorage.getItem("expireTime")}`);

    // Update state in context provider
    dispatch({
      type: reducerCases.SET_TOKEN,
      token: responseData?.access_token,
    });
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expireTime = Number(localStorage.getItem("expireTime"));
      const currentTime = Date.now();
      if (expireTime && currentTime >= expireTime) {
        getRefreshToken();
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 30000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, [refreshToken, accessToken]);

  const getRefreshToken = async () => {
    try {
      await axios
        .get(
          `https://tunestellar-api.onrender.com/refresh_token?refresh_token=${refreshToken}`
        )
        .then((res) => {
          handleTokenResponse(res.data);
        });
    } catch (error) {
      console.error("Error refreshing access token:", error);
      window.location.replace("/login");
    }
  };

  const getRenderComponent = () => {
    if (!token) {
      return <Login />;
    } else {
      return <AppWrapper />;
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {getRenderComponent()}
    </ThemeProvider>
  );
}
