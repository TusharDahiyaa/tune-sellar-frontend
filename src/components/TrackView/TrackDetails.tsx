import { reducerCases } from "@/utils/Constants";
import { useContextValue } from "@/utils/ContextProvider";
import axios from "axios";
import { FaPlay } from "react-icons/fa";

type TrackItemProps = {
  title: string;
  artist: string;
  duration: string;
  imageLink: string;
  track_uri: string;
};

export default function TrackItem({
  title,
  artist,
  duration,
  imageLink,
  track_uri,
}: TrackItemProps) {
  const [{ token }, dispatch] = useContextValue();

  const playSelectedTrack = async (track_uri: any) => {
    const response = await axios.put(
      `https://api.spotify.com/v1/me/player/play`,
      {
        uris: [track_uri],
        // offset: {
        //   position: trackNumber - 1,
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
    <div className="text-xs m-1 dark:bg-gradient-to-l	from-slate-500 to-slate-900 light: bg-zinc-200 rounded p-2">
      <div
        className="flex gap-4 justify-between items-center cursor-pointer"
        onClick={() => playSelectedTrack(track_uri)}
      >
        <div className="flex gap-1 items-center">
          <img
            src={imageLink}
            width={40}
            height={40}
            alt=""
            className="rounded"
          />
          <div>
            <h2 className="my-1 w-44 text-nowrap overflow-hidden overflow-ellipsis hover:text-wrap hover:">
              {title}
            </h2>
            <p className="my-1 w-44 text-nowrap overflow-hidden">By {artist}</p>
          </div>
        </div>
        <div className="w-8">
          <button className="my-1">
            <FaPlay />
          </button>
          <p className="my-1">{duration}</p>
        </div>
      </div>
    </div>
  );
}
