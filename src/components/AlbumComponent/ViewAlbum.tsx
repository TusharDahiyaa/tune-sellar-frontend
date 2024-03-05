import { useContextValue } from "@/utils/ContextProvider";
import { LuDot } from "react-icons/lu";
import { AiFillPlayCircle } from "react-icons/ai";
import { RxDotsHorizontal } from "react-icons/rx";
import { formatDuration } from "../PlaylistComponents/SongRow";
import { useEffect, useState } from "react";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import axios from "axios";
import { reducerCases } from "@/utils/Constants";

export default function ViewAlbum() {
  const [{ token, selectedAlbumId, selectedAlbum }, dispatch] =
    useContextValue();
  const [, setLoading] = useState(false);

  useEffect(() => {
    const selectedAlbumInfo = async () => {
      setLoading(true);
      Loading.pulse("Loading Album Information...");
      const response = await axios.get(
        `https://api.spotify.com/v1/albums/${selectedAlbumId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const albumData = response.data;

      dispatch({
        type: reducerCases.SET_ALBUM,
        selectedAlbum: albumData,
      });

      // catch((err) => {
      //   alert("An error occurred while fetching album information");
      //   console.error(
      //     "An error occurred while fetching album information: " + err
      //   );
      // });

      setLoading(false);
      Loading.remove();
    };

    if (token != null) {
      selectedAlbumInfo();
    }
  }, [token, dispatch, selectedAlbumId]);

  const playSelectedPlaylist = async (selectedTrack: any) => {
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

  const formattedDate = (addedAt: any) => {
    return new Date(addedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-xl dark:bg-stone-800 dark:bg-opacity-60 mx-2 view-playlist light:bg-stone-200 light:text-zinc-800 ">
      <div className="flex items-end pt-5 ps-5">
        <img
          src={selectedAlbum?.images[0].url}
          className="w-52 h-52 shadow-2xl shadow-gray-800/90"
          alt=""
        />
        <div className="ms-2">
          <p className="font-semibold dark:text-zinc-200 light:text-zinc-800">
            ALBUM
          </p>
          <p className="text-4xl font-sans dark:text-zinc-200 tracking-wide my-1 light: text-zinc-800">
            {selectedAlbum?.name}
          </p>
          <p className=" dark:text-gray-300 light:text-zinc-800">
            {selectedAlbum?.description}
          </p>
          <p className="dark:text-stone-400 light:text-stone-500 my-1">
            ARTISTS:{" "}
            {selectedAlbum?.artists
              .map((artist: any) => artist?.name)
              .join(", ")}
          </p>
          <p className="mt-4 dark:text-gray-200 flex items-center light:text-zinc-800">
            {selectedAlbum?.label} <LuDot size={30} />
            {selectedAlbum?.total_tracks}{" "}
            {selectedAlbum?.total_tracks > 1 ? "songs" : "song"}
          </p>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-5 mt-3 ms-2">
          <AiFillPlayCircle
            size={72}
            className="ms-2 fill-[#1DB954] light:fill-green-600 cursor-pointer"
            onClick={() => {
              playSelectedPlaylist(selectedAlbum);
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
            <p className="dark:text-stone-400 light:text-stone-500 flex items-center">
              Duration
            </p>
          </div>
          {selectedAlbum?.tracks?.items?.map((item: any, index: number) => (
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
                  <div className="w-96">
                    <p className="text-bold">
                      {item.name ? item.name : "Song Unavailable"}
                    </p>
                    <p className="dark:text-stone-400 light:text-stone-500">
                      {item.artists
                        .map((artist: any) => artist.name)
                        .join(", ")}
                    </p>
                  </div>
                </div>
                {item.added_at ? (
                  <p className="dark:text-stone-400 light:text-stone-500 flex items-center">
                    {item.name ? formattedDate(item.added_at) : ""}
                  </p>
                ) : (
                  ""
                )}
                <p className="dark:text-stone-400 light:text-stone-500 flex items-center">
                  {item.name ? formatDuration(item.duration_ms) : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
