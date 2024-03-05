import { reducerCases } from "@/utils/Constants";
import { useContextValue } from "@/utils/ContextProvider";
import axios from "axios";

const SongRow = ({ track, index }: any) => {
  const [{ token }, dispatch] = useContextValue();
  const addedAt = track.added_at;
  const formattedDate = new Date(addedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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
      className="px-2 py-1 mx-2 shadow text-sm bg-stone-900 bg-opacity-30 hover:bg-opacity-60 light:bg-stone-300 cursor-pointer"
      onClick={() => {
        playSelectedTrack(track.track);
      }}
    >
      <div className="flex justify-between">
        <div className="flex items-center flex-wrap">
          <span className="flex items-center me-3">{index + 1}</span>
          {track.track.name ? (
            <img
              src={track.track.album.images[0].url}
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
            <p className="text-bold">
              {track.track.name ? track.track.name : "Song Unavailable"}
            </p>
            <p className="dark:text-stone-400 light:text-stone-500">
              {track.track.artists.map((artist: any) => artist.name).join(", ")}
            </p>
          </div>
        </div>
        {track.added_at ? (
          <p className="dark:text-stone-400 light:text-stone-500 flex items-center">
            {track.track.name ? formattedDate : ""}
          </p>
        ) : (
          ""
        )}
        <p className="dark:text-stone-400 light:text-stone-500 flex items-center">
          {track.track.name ? formatDuration(track.track.duration_ms) : ""}
        </p>
      </div>
    </div>
  );
};

export function formatDuration(duration_ms: number) {
  // Calculate hours, minutes, and seconds, ensuring correct handling of edge cases
  const hours = Math.floor((duration_ms / 1000 / 3600) % 24);
  const minutes = Math.floor((duration_ms / 1000 / 60) % 60);
  const seconds = Math.floor((duration_ms / 1000) % 60);

  // Build the formatted string, excluding unnecessary hours and padding
  let formattedDuration = "";
  if (hours > 0) {
    formattedDuration += `${hours}:`;
  }
  formattedDuration += minutes.toString().padStart(2, "0") + ":";
  formattedDuration += seconds.toString().padStart(2, "0");

  return formattedDuration;
}

export default SongRow;
