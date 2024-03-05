import { useContextValue } from "@/utils/ContextProvider";
import SongRow from "../PlaylistComponents/SongRow";
import { useEffect, useState } from "react";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import axios from "axios";
import { reducerCases } from "@/utils/Constants";

export default function RecentlyPlayed() {
  const [{ token, selectedPlaylistId, recentlyPlayedTracks }, dispatch] =
    useContextValue();
  const [, setLoading] = useState(false);

  useEffect(() => {
    const selectedPlaylistInfo = async () => {
      setLoading(true);
      Loading.pulse("Loading..");
      const response = await axios.get(
        `https://api.spotify.com/v1/me/player/recently-played?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { items } = response.data;

      const filteredTracks: {
        track: any;
        played_at: string;
        context?: any;
      }[] = [];
      const seenIds: Set<string> = new Set();
      items.forEach((item: any) => {
        const trackId = item.track.id;
        if (!seenIds.has(trackId)) {
          seenIds.add(trackId);
          filteredTracks.push(item);
        }
      });

      dispatch({
        type: reducerCases.SET_RECENTLY_PLAYED_TRACKS,
        recentlyPlayedTracks: filteredTracks,
      });

      setLoading(false);
      Loading.remove();
    };

    if (token != null) {
      selectedPlaylistInfo();
    }
  }, [token, dispatch, selectedPlaylistId]);

  return (
    <div className="rounded-xl dark:bg-stone-800 dark:bg-opacity-60 mx-2 view-playlist light:bg-stone-200 light:text-zinc-800 ">
      <div className="py-2 px-3 ">
        <div className="p-2 text-center rounded-full dark:bg-gradient-to-b from-stone-900 to-zinc-700 light: bg-zinc-400">
          <p className="text-4xl font-sans dark:text-zinc-200 tracking-wide my-1 light: text-zinc-800 ">
            Recently Played
          </p>
        </div>
      </div>
      <div>
        <div className="mt-5">
          <div className="flex justify-between"></div>
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
          {recentlyPlayedTracks?.map((item: any, index: number) => (
            <SongRow key={item.played_at} track={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
