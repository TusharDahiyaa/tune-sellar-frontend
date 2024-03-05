import { useContextValue } from "@/utils/ContextProvider";
import { LuDot } from "react-icons/lu";
import { AiFillPlayCircle } from "react-icons/ai";
import { RxDotsHorizontal } from "react-icons/rx";
import SongRow from "./SongRow";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { reducerCases } from "@/utils/Constants";
import { formatNumberWithCommas } from "../ArtistComponent/ViewArtist";

interface PlaylistItem {
  id: string;
  track: any; // Adjust the type according to your track structure
}

interface Playlist {
  name: string;
  description: string;
  owner: {
    display_name: string;
  };
  images: { url: string }[];
  followers: { total: number };
  tracks: {
    total: number;
    items: PlaylistItem[];
  };
}

export default function ViewPlaylist() {
  const [{ token, selectedPlaylistId, selectedPlaylist }, dispatch] =
    useContextValue();
  const [loading, setLoading] = useState(false);

  const selectedPlaylistInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<Playlist>(
        `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const playlistData = response.data;
      dispatch({
        type: reducerCases.SET_PLAYLIST,
        selectedPlaylist: playlistData,
      });
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setLoading(false);
      Loading.remove();
    }
  }, [selectedPlaylistId, token, dispatch]);

  useEffect(() => {
    if (token != null) {
      selectedPlaylistInfo();
    }
  }, [token, selectedPlaylistId, selectedPlaylistInfo]);

  const playSelectedPlaylist = useCallback(
    async (selectedTrack: any) => {
      try {
        const response = await axios.put(
          `https://api.spotify.com/v1/me/player/play`,
          {
            context_uri: selectedTrack.uri,
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
        console.error("Error playing playlist:", error);
      }
    },
    [token, dispatch]
  );

  return (
    <div className="rounded-xl dark:bg-stone-800 dark:bg-opacity-60 mx-2 view-playlist light:bg-stone-200 light:text-zinc-800 ">
      {loading && Loading.pulse("Loading Playlist...")}
      {selectedPlaylist && (
        <>
          <div className="flex items-end pt-5 ps-5">
            <img
              src={selectedPlaylist?.images[0]?.url}
              className="w-52 h-52 shadow-2xl shadow-gray-800/90"
              alt=""
            />
            <div className="ms-2">
              <p className="font-semibold dark:text-zinc-200 light:text-zinc-800">
                PLAYLIST
              </p>
              <p className="text-4xl font-sans dark:text-zinc-200 tracking-wide my-1 light: text-zinc-800">
                {selectedPlaylist?.name}
              </p>
              <p className=" dark:text-gray-300 light:text-zinc-800">
                {selectedPlaylist?.description}
              </p>
              <p className="mt-4 dark:text-gray-200 flex items-center light:text-zinc-800">
                {selectedPlaylist?.owner?.display_name} <LuDot size={30} />
                {formatNumberWithCommas(
                  selectedPlaylist?.followers?.total
                )}{" "}
                likes <LuDot size={30} />
                {selectedPlaylist?.tracks?.total} songs
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-5 mt-3 ms-2">
              <AiFillPlayCircle
                size={72}
                className="ms-2 fill-[#1DB954] light:fill-green-600 cursor-pointer"
                onClick={() => {
                  playSelectedPlaylist(selectedPlaylist);
                }}
              />
              <RxDotsHorizontal size={32} className="cursor-pointer" />
            </div>
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
              {selectedPlaylist?.tracks?.items?.map(
                (item: any, index: number) => (
                  <SongRow key={item.track.id} track={item} index={index} />
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
