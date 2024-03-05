import { useContextValue } from "@/utils/ContextProvider";
import { formatDuration } from "../PlaylistComponents/SongRow";
import { useEffect, useState } from "react";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import axios from "axios";
import { reducerCases } from "@/utils/Constants";

export default function ViewArtist() {
  const [
    { token, selectedArtistId, selectedArtist, artistTopSongs },
    dispatch,
  ] = useContextValue();
  const [, setLoading] = useState(false);

  useEffect(() => {
    const selectedArtistInfo = async () => {
      setLoading(true);
      Loading.pulse("Loading Album Information...");
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${selectedArtistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const artistData = response.data;

      dispatch({
        type: reducerCases.SET_ARTIST,
        selectedArtist: artistData,
      });

      setLoading(false);
      Loading.remove();
    };

    if (token != null) {
      selectedArtistInfo();
    }
  }, [token, dispatch, selectedArtistId]);

  useEffect(() => {
    const artistTopSongs = async () => {
      setLoading(true);
      Loading.pulse("Loading Album Information...");
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${selectedArtistId}/top-tracks?market=IN`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const artistSongData = response.data;

      dispatch({
        type: reducerCases.SET_ARTIST_TOP_SONGS,
        artistTopSongs: artistSongData,
      });

      setLoading(false);
      Loading.remove();
    };

    if (token != null) {
      artistTopSongs();
    }
  }, [token, dispatch, selectedArtistId]);

  const playSelectedTrack = async (selectedTrack: any) => {
    const response = await axios.put(
      `https://api.spotify.com/v1/me/player/play`,
      {
        uris: [selectedTrack.uri],
        // offset: {
        //   position: selectedTrack.track_number - 1,
        // },
        position_ms: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status == 204) {
      const { item } = response.data;
      const currentlyPlayingTrack = item;
      dispatch({
        type: reducerCases.SET_CURRENT_TRACK,
        currentTrack: currentlyPlayingTrack,
      });
      dispatch({
        type: reducerCases.SET_PLAYER_STATE,
        playerState: true,
      });
    }
  };

  return (
    <div className="rounded-xl dark:bg-stone-800 dark:bg-opacity-60 mx-2 view-playlist light:bg-stone-200 light:text-zinc-800 ">
      <div className="flex items-end pt-5 ps-5">
        <img
          src={selectedArtist?.images[0].url}
          className="w-52 h-52 shadow-2xl shadow-gray-800/90"
          alt=""
        />
        <div className="ms-2">
          <p className="font-semibold dark:text-zinc-200 light:text-zinc-800">
            ARTIST
          </p>
          <p className="text-4xl font-sans dark:text-zinc-200 tracking-wide my-1 light: text-zinc-800">
            {selectedArtist?.name}
          </p>
          <p className=" dark:text-gray-300 light:text-zinc-800">
            Followers:{" "}
            {selectedArtist?.followers
              ? formatNumberWithCommas(selectedArtist?.followers["total"])
              : "-"}
          </p>
          <p className="dark:text-stone-400 light:text-stone-500 my-1">
            Genres:{" "}
            {selectedArtist?.genres.map((genre: any) => genre).join(", ")}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <h2 className="text-3xl m-4 font-bold">Top Songs</h2>
        <div className="flex justify-between px-2 py-1 mx-1">
          <div className="flex items-center">
            <span className="flex items-center me-2">#</span>
            <div className="w-96">
              <p className="text-bold ms-4">Title</p>
            </div>
          </div>
          <p className="dark:text-stone-400 light:text-stone-500 flex items-center">
            Duration
          </p>
        </div>
        {artistTopSongs?.tracks?.map((item: any, index: number) => (
          <div
            className="px-2 py-1 mx-2 shadow text-sm bg-stone-900 bg-opacity-30 hover:bg-opacity-60 light:bg-stone-300 cursor-pointer"
            key={item.id}
            onClick={() => {
              playSelectedTrack(item);
            }}
          >
            <div className="flex justify-between">
              <div className="flex items-center flex-wrap">
                <span className="flex items-center me-5">{index + 1}</span>
                {item.name ? (
                  <img
                    src={item.album.images[1].url}
                    alt="Album Cover"
                    className="w-12 mr-2 ms-4"
                  />
                ) : (
                  <img
                    src="https://picsum.photos/200/?grayscale&blur=10"
                    alt=""
                    className="w-12 h-12 mr-2 ms-4"
                  />
                )}
                <div className="w-96">
                  <p className="text-bold mb-1">
                    {item.name ? item.name : "Song Unavailable"}
                  </p>
                  <p className="dark:text-stone-400 light:text-stone-500">
                    {item.artists.map((artist: any) => artist.name).join(", ")}
                  </p>
                </div>
              </div>
              <p className="dark:text-stone-400 light:text-stone-500 flex items-center">
                {item.name ? formatDuration(item.duration_ms) : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function formatNumberWithCommas(number: number) {
  // Convert number to string and split the integer and decimal parts
  const parts = number?.toString().split(".");

  // Check if parts is not undefined and integer part exists
  if (parts && parts[0]) {
    // Add commas to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Join integer and decimal parts and return
  return parts ? parts.join(".") : ""; // Return empty string if parts is undefined
}
