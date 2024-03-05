import { useContextValue } from "@/utils/ContextProvider";
import PlayerControls from "./PlayerControls";
import PlayingSong from "./PlayingSong";
import { useEffect, useState } from "react";
import axios from "axios";
import { reducerCases } from "@/utils/Constants";

export default function PlayerUI() {
  const [{ token }, dispatch] = useContextValue();
  const [, setPaused] = useState<boolean>(false);
  const [is_active, setActive] = useState<boolean>(false);
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [current_track, setCurrentTrack] = useState<any>("");
  const [currentDeviceId, setCurrentDeviceId] = useState<string>();

  useEffect(() => {
    const getCurrentlyPlaying = async () => {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/player/currently-playing`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data !== "") {
        const { item } = response.data;
        const currentlyPlayingTrack = item;
        dispatch({
          type: reducerCases.SET_CURRENT_TRACK,
          currentTrack: currentlyPlayingTrack,
        });
      }
    };

    if (token != null) {
      getCurrentlyPlaying();
    }
  }, [token, dispatch]);

  useEffect(() => {
    const transferPlayback = async () => {
      await axios.put(
        `https://api.spotify.com/v1/me/player`,
        {
          device_ids: [currentDeviceId],
          // play: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    };

    if (token !== null && currentDeviceId) {
      transferPlayback();
    }
  }, [token, dispatch, currentDeviceId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Tune Stellar",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: 0.4,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        // console.log("Ready with Device ID", device_id);
        setCurrentDeviceId(device_id);
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      player.connect();
      // .then((success) => {
      //   if (success) {
      //     console.log(
      //       "The Web Playback SDK successfully connected to Spotify!"
      //     );
      //   }
      // });

      player.addListener(
        "player_state_changed",
        (state: Spotify.PlaybackState) => {
          if (!state) {
            return;
          }

          var current_track = state.track_window.current_track;
          // var next_track = state.track_window.next_tracks[0];

          setCurrentTrack(current_track);
          setPaused(!state.paused);
          setActive(!!state);
        }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [token, dispatch]);

  return is_active ? (
    <>
      <div className="bg-transparent py-2 w-lvw backdrop-blur-md flex items-center justify-between px-5 pe-10">
        <PlayingSong currentSong={current_track} />
        <PlayerControls mainPlayer={player} deviceId={currentDeviceId} />
      </div>
    </>
  ) : (
    <>
      <div className="bg-transparent py-3.5 w-lvw backdrop-blur-md text-center">
        Instance not active. Transfer your playback using your Spotify app.
        <br />
        Go to spotify and select the device Tune Stellar to play from here.
      </div>
    </>
  );
}
