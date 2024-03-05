import { reducerCases } from "@/utils/Constants";
import { useContextValue } from "@/utils/ContextProvider";
import axios from "axios";
import { useEffect } from "react";
import { LuDot } from "react-icons/lu";

export default function UserPlaylists() {
  const [{ playlists, token }, dispatch] = useContextValue();

  useEffect(() => {
    const getPlaylistData = async () => {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/playlists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { items } = response.data;
      dispatch({ type: reducerCases.SET_PLAYLISTS, playlists: items });
    };

    if (token != null) {
      getPlaylistData();
    }
  }, [token, dispatch]);

  return (
    <>
      {playlists?.map((playlist: any) => (
        <div
          className="text-sm my-2 pt-1 px-2 rounded mx-1 overflow-hidden overflow-ellipsis text-nowrap w-60"
          key={playlist.name}
        >
          <div
            onClick={() => {
              dispatch({
                type: reducerCases.SET_SELECTED_PLAYLIST_ID,
                selectedPlaylistId: playlist.id,
              });
              dispatch({
                type: reducerCases.SET_SELECTED_COMPONENT,
                selectedComponent: `playlist/${playlist?.id}`,
              });
            }}
            className="cursor-pointer flex items-center"
          >
            <img
              src={playlist?.images[0].url}
              alt=""
              className="w-10 h-10 me-2 rounded"
            />
            <div>
              <h4 className="mt-1">{playlist.name}</h4>
              <div>
                {playlist.owner.display_name == "undefined" ? (
                  ""
                ) : (
                  <div className="flex items-center">
                    Playlist
                    <LuDot size={26} className="-mx-1.5" />{" "}
                    {playlist.owner.display_name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
