import { useContextValue } from "@/utils/ContextProvider";
import SongRow from "../PlaylistComponents/SongRow";
import { useEffect, useState } from "react";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import axios from "axios";
import { reducerCases } from "@/utils/Constants";

export default function LikedSongs() {
  const [{ token, likedSongs }, dispatch] = useContextValue();
  const [, setLoading] = useState(false);

  useEffect(() => {
    const likedSongs = async () => {
      setLoading(true);
      Loading.pulse("Loading..");
      const response = await axios.get(`https://api.spotify.com/v1/me/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { items } = response.data;

      dispatch({
        type: reducerCases.SET_LIKED_SONGS,
        likedSongs: items,
      });

      setLoading(false);
      Loading.remove();
    };

    if (token != null) {
      likedSongs();
    }
  }, [token, dispatch]);

  return (
    <div className="rounded-xl dark:bg-stone-800 dark:bg-opacity-60 mx-2 view-playlist light:bg-stone-200 light:text-zinc-800 ">
      <div className="py-2 px-3">
        <div className="p-2 text-center rounded-full dark:bg-gradient-to-b from-stone-900 to-zinc-700 light: bg-zinc-400">
          <p className="text-4xl font-sans dark:text-zinc-200 tracking-wide my-1 light: text-zinc-800 ">
            Liked Songs
          </p>
        </div>
      </div>
      <div>
        {likedSongs?.length > 0 ? (
          <div className="mt-5">
            <div className="flex justify-between"></div>
            <div className="flex justify-between px-2 py-1 mx-1">
              <div className="flex items-center">
                <span className="flex items-center me-2">#</span>
                <div className="w-96">
                  <p className="text-bold ms-4">Title</p>
                </div>
              </div>
              <p className="dark:text-stone-400 light:text-stone-500 flex items-center ms-24">
                Date Added
              </p>
              <p className="dark:text-stone-400 light:text-stone-500 flex items-center">
                Duration
              </p>
            </div>
            {likedSongs?.map((item: any, index: number) => (
              <SongRow key={index} track={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center text-2xl w-96 mx-auto relative top-32 border-2 bg-zinc-900 p-5">
            No liked songs. Click the heart icon on a song to add it to your
            likes list.
          </div>
        )}
      </div>
    </div>
  );
}
