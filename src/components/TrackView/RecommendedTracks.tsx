import { useContextValue } from "@/utils/ContextProvider";
import axios from "axios";
import { useEffect } from "react";
import { reducerCases } from "@/utils/Constants";
import TrackItem from "./TrackDetails";
import { formatDuration } from "../PlaylistComponents/SongRow";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  duration_ms: number;
  album: { images: { url: string }[] };
  uri: string;
  track_number: number;
}

export default function RecommendedTracks() {
  const [{ token, topTracks, recommendedTracks }, dispatch] = useContextValue();

  useEffect(() => {
    const fetchTopUserTracks = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/top/tracks?limit=5`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const { items } = response.data;
        dispatch({
          type: reducerCases.SET_TOP_TRACKS,
          topTracks: items,
        });
      } catch (error) {
        console.error("Error fetching top user tracks:", error);
      }
    };

    if (token) {
      fetchTopUserTracks();
    }
  }, [token, dispatch]);

  const topTracksIds = topTracks?.map((track: any) => track.id).join(",");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/recommendations?seed_tracks=${topTracksIds}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const { tracks } = response.data;
        dispatch({
          type: reducerCases.SET_RECOMMENDED_TRACKS,
          recommendedTracks: tracks,
        });
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    if (token && topTracksIds) {
      fetchRecommendations();
    }
  }, [token, dispatch, topTracksIds]);

  return (
    <div className="pb-20 rounded-l-xl px-1 pt-4 h-lvh m-[0.5] flex flex-col dark:text-zinc-200 dark:bg-[#18181B] light:text-zinc-800 light:bg-zinc-100">
      <h2 className="text-xl font-semibold text-center">Recommended Tracks</h2>
      <ul className="recommendTrackScroll">
        {recommendedTracks?.map((track: Track) => (
          <TrackItem
            key={track.id}
            title={track.name}
            artist={track.artists.map((artist) => artist.name).join(", ")}
            duration={formatDuration(track.duration_ms)}
            imageLink={track.album.images[0].url}
            track_uri={track.uri}
          />
        ))}
      </ul>
    </div>
  );
}
