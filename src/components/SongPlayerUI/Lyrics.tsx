import React, { useEffect, useState } from "react";
import { useContextValue } from "@/utils/ContextProvider";
import axios from "axios";
import { Loading } from "notiflix/build/notiflix-loading-aio";

const Lyrics = React.memo(() => {
  const [{ token, currentTrack }, dispatch] = useContextValue();
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [backgroundStyle, setBackgroundStyle] = useState<string>("");

  useEffect(() => {
    const getSongLyrics = async () => {
      try {
        setLoading(true);
        Loading.dots("Loading lyrics...");

        const response = await axios.get(
          `https://tunestellar-backend.netlify.app/getLyrics?songName=${currentTrack?.name}&artist=${currentTrack?.artists[0]?.name}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data !== "") {
          const lyricsData = response.data;
          setLyrics(lyricsData);
        } else {
          console.error("Failed to fetch lyrics");
        }
      } catch (err) {
        console.error(`Error! ${err}`);
      } finally {
        Loading.remove();
        setLoading(false);
      }
    };

    // Function to generate a random dark color in hex format
    const getRandomDarkColor = () => {
      const randomHue = Math.floor(Math.random() * 360); // Random hue value
      const randomSaturation = Math.floor(Math.random() * 25 + 25); // Saturation between 25 and 50
      const randomLightness = Math.floor(Math.random() * 40 + 10); // Lightness between 10 and 30
      return `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;
    };

    // Background style with a gradient of two or three random dark colors
    const color1 = getRandomDarkColor();
    const color2 = getRandomDarkColor();
    const color3 = getRandomDarkColor();
    setBackgroundStyle(
      `linear-gradient(to right, ${color1}, ${color2}, ${color3})`
    );

    if (token !== null) {
      getSongLyrics();
    }
  }, [token, dispatch, currentTrack]);

  return (
    <div
      className="rounded-xl dark:bg-opacity-60 mx-2 view-playlist text-stone-200"
      style={{ background: backgroundStyle }}
    >
      <h2 className="text-center mt-5 text-xl font-bold">Lyrics</h2>
      <h1 className="text-4xl font-semibold text-center mt-5 border-y-2 border-zinc-400 w-fit py-2 mx-auto">
        {currentTrack?.name}
      </h1>
      <p className="text-center my-2">
        By{" "}
        {currentTrack?.artists
          ?.map((artist: any) => {
            return artist.name;
          })
          ?.join(", ") ?? ""}
      </p>
      <div className="text-center text-xs">
        Powered by the Genius API.
        <br />
        Please note: Lyrics accuracy may vary.
      </div>
      {/* <h2>Artist: {songInfo?.artist}</h2> */}
      {/* <img src={songInfo?.albumArt} className="w-28" alt="Album Art" /> */}
      {loading ? (
        <p className="text-center text-3xl my-10">Loading lyrics...</p>
      ) : lyrics && lyrics ? (
        <pre className="text-center text-xl my-5 px-5 text-wrap">{lyrics}</pre>
      ) : (
        <p className="text-center text-3xl my-10">Lyrics not available</p>
      )}
    </div>
  );
});

export default Lyrics;
