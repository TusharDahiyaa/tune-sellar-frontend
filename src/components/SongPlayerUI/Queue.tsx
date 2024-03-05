import { useContextValue } from "@/utils/ContextProvider";
import { useEffect } from "react";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import axios from "axios";
import { reducerCases } from "@/utils/Constants";
import { formatDuration } from "../PlaylistComponents/SongRow";
import { BsSoundwave } from "react-icons/bs";

export default function Queue() {
  const [{ token, queueSongs, currentTrack }, dispatch] = useContextValue();

  useEffect(() => {
    const getQueueSongs = async () => {
      Loading.dots("Loading Queue..");
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/player/queue`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const queueData = response.data;

        const filteredQueue = queueData?.queue.filter(
          (queueItem: any, index: number, self: any) =>
            index === self.findIndex((item: any) => item.id === queueItem.id)
        );

        dispatch({
          type: reducerCases.SET_QUEUE,
          queueSongs: filteredQueue,
        });
      } catch (error) {
        console.error("Error fetching queue songs:", error);
      } finally {
        Loading.remove();
      }
    };

    if (token) {
      getQueueSongs();
    }
  }, [token, dispatch, currentTrack]);

  const playSelectedTrack = async (selectedTrack: any) => {
    try {
      const response = await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        {
          uris: [selectedTrack.uri],
          position_ms: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
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
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  return (
    <div className="rounded-xl dark:bg-stone-800 dark:bg-opacity-60 mx-2 view-playlist light:bg-stone-200 light:text-zinc-800">
      <h2 className="text-center mt-5 text-xl font-bold">Queue</h2>
      {currentTrack && (
        <div
          className="px-2 py-1 mx-2 shadow text-sm bg-stone-900 bg-opacity-30 hover:bg-opacity-60 light:bg-stone-300 cursor-pointer my-2"
          onClick={() => playSelectedTrack(currentTrack)}
        >
          <div className="flex items-center">
            <BsSoundwave size={28} className="fill-[#22c55e] animate-pulse" />
            <div className="flex items-center flex-wrap">
              <img
                src={
                  currentTrack?.album?.images[0]?.url ||
                  "https://picsum.photos/200/?grayscale&blur=10"
                }
                alt="Album Cover"
                className="w-12 mr-2 ms-4"
              />
              <div className="w-96">
                <p className="text-bold">
                  {currentTrack.name || "Song Unavailable"}
                </p>
                <p className="dark:text-stone-400 light:text-stone-500">
                  {currentTrack.artists
                    .map((artist: any) => artist.name)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {queueSongs?.map((queueSong: any) => (
        <div
          key={queueSong.id}
          className="px-2 py-1 mx-2 shadow text-sm bg-stone-900 bg-opacity-30 hover:bg-opacity-60 light:bg-stone-300 cursor-pointer"
          onClick={() => playSelectedTrack(queueSong)}
        >
          <div className="flex justify-between">
            <div className="flex items-center flex-wrap">
              <img
                src={
                  queueSong?.album?.images[0]?.url ||
                  "https://picsum.photos/200/?grayscale&blur=10"
                }
                alt="Album Cover"
                className="w-12 mr-2 ms-4"
              />
              <div className="w-96">
                <p className="text-bold">
                  {queueSong.name || "Song Unavailable"}
                </p>
                <p className="dark:text-stone-400 light:text-stone-500">
                  {queueSong.artists
                    .map((artist: any) => artist.name)
                    .join(", ")}
                </p>
              </div>
            </div>
            <p className="dark:text-stone-400 light:text-stone-500 flex items-center">
              {queueSong.name ? formatDuration(queueSong.duration_ms) : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
