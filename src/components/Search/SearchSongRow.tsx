import { useContextValue } from "@/utils/ContextProvider";
import axios from "axios";
import { reducerCases } from "@/utils/Constants";
import { formatDuration } from "../PlaylistComponents/SongRow";

export default function SearchSongRow({ track }: any) {
  const [{ token }, dispatch] = useContextValue();

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
    <div
      className="group cursor-pointer dark:bg-stone-800 light: bg-stone-200 rounded-lg overflow-hidden flex items-center py-2 px-4 hover:bg-stone-700 transition duration-200 ease-in-out hover:shadow-md shadow-sm dark:text-white light: text-black"
      onClick={() => {
        playSelectedTrack(track);
      }}
    >
      <img
        src={track.album.images[0].url}
        alt="Album Cover"
        className="w-12 h-12 mr-4 rounded-lg object-cover"
      />
      <div className="flex-grow">
        <h4 className="text-sm font-semibold truncate">
          {track.name ? track.name : "Song Unavailable"}
        </h4>
        <p className="text-sm truncate">
          {track.artists.map((artist: any) => artist.name).join(", ")}
        </p>
      </div>
      <div className="hidden group-hover:flex items-center text-gray-300 text-sm">
        {track.name && (
          <span className="mr-2">{formatDuration(track.duration_ms)}</span>
        )}
        <i className="fas fa-play text-lg"></i>
      </div>
    </div>
  );
}
