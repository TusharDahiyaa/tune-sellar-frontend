import React, { useEffect, useState } from "react";
import ExtraControlsUI from "./ExtraControlsUI";
import { TiArrowShuffle } from "react-icons/ti";
import { GiPreviousButton, GiNextButton } from "react-icons/gi";
import { TbRepeat, TbRepeatOnce } from "react-icons/tb";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { useContextValue } from "@/utils/ContextProvider";
import axios from "axios";
import { reducerCases } from "@/utils/Constants";
import { formatDuration } from "../PlaylistComponents/SongRow";

const PlayerControls = React.memo(({ mainPlayer }: any) => {
  const [
    { token, playerState, currentTrack, shuffleState, repeatMode },
    dispatch,
  ] = useContextValue();
  const [currentProgressMS, setCurrentProgressMS] = useState<number>(0);
  const [prevCurrentTrackId, setPrevCurrentTrackId] = useState<string | null>(
    null
  );
  const [rangeFillStyle, setRangeFillStyle] = useState<React.CSSProperties>({
    background: `linear-gradient(to right, #22c55e 0%, transparent 0%)`,
  });

  const getPlaybackState = async () => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.item) {
        const { item, shuffle_state, repeat_state, progress_ms } =
          response.data;

        setCurrentProgressMS(progress_ms);

        if (item && item.id !== prevCurrentTrackId) {
          dispatch({
            type: reducerCases.SET_PLAYER_STATE,
            playerState: response.data.is_playing,
          });

          dispatch({
            type: reducerCases.SET_CURRENT_TRACK,
            currentTrack: item,
          });

          dispatch({
            type: reducerCases.SET_SHUFFLE,
            shuffleState: shuffle_state,
          });

          dispatch({
            type: reducerCases.SET_REPEAT_MODE,
            repeatMode: repeat_state,
          });

          setPrevCurrentTrackId(item.id);
        }
      } else {
        setPrevCurrentTrackId(null);

        dispatch({
          type: reducerCases.SET_CURRENT_TRACK,
          currentTrack: null,
        });
      }
    } catch (error) {
      console.error("Error fetching playback state:", error);
    }
  };

  useEffect(() => {
    if (token != null) {
      const intervalId = setInterval(getPlaybackState, 500);

      return () => clearInterval(intervalId); // Cleanup function to clear the interval
    }
  }, [token, dispatch, prevCurrentTrackId]);

  const changeTrack = async (type: string) => {
    await axios.post(
      `https://api.spotify.com/v1/me/player/${type}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const response = await axios.get(
      `https://api.spotify.com/v1/me/player/currently-playing`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.item) {
      const { item } = response.data;
      dispatch({
        type: reducerCases.SET_CURRENT_TRACK,
        currentTrack: item,
      });
    } else {
      dispatch({
        type: reducerCases.SET_CURRENT_TRACK,
        currentTrack: null,
      });
    }
  };

  const changeState = async () => {
    const state = playerState ? "pause" : "play";
    mainPlayer.togglePlay();

    await axios.put(
      `https://api.spotify.com/v1/me/player/${state}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: reducerCases.SET_PLAYER_STATE,
      playerState: !playerState,
    });
  };

  const seekToPosition = async (e: any) => {
    const seekValue = parseInt(e);

    const response = await axios.put(
      `https://api.spotify.com/v1/me/player/seek?position_ms=${seekValue}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.error) {
      dispatch({
        type: reducerCases.SEEK_TO_POSITION,
        positionMs: seekValue,
      });
    } else {
      alert(`Error seeking to position: ${response.data.error.message}`);
    }

    mainPlayer.seek(seekValue);
  };

  const shuffleTracks = async () => {
    const boolValue = !shuffleState;
    await axios
      .put(
        `https://api.spotify.com/v1/me/player/shuffle?state=${boolValue}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        dispatch({
          type: reducerCases.SET_SHUFFLE,
          shuffleState: boolValue,
        });
      });
  };

  const handleRepeatButton = async () => {
    const nextRepeatMode =
      repeatMode === "track"
        ? "context"
        : repeatMode === "context"
        ? "off"
        : "track";

    // Update the repeat mode in the reducer
    dispatch({
      type: reducerCases.SET_REPEAT_MODE,
      repeatMode: nextRepeatMode,
    });

    // Update the repeat mode on Spotify using the correct API call
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/repeat?state=${nextRepeatMode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating repeat mode on Spotify:", error);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  };

  useEffect(() => {
    setRangeFillStyle({
      background: `linear-gradient(to right, #22c55e ${
        (currentProgressMS / currentTrack?.duration_ms) * 100
      }%, transparent ${
        (currentProgressMS / currentTrack?.duration_ms) * 100
      }%)`,
    });
  }, [currentProgressMS, currentTrack]);

  return (
    <>
      <div className="player-controls text-center">
        <div className="inline-flex items-center gap-6">
          {shuffleState ? (
            <TiArrowShuffle
              size={26}
              className="fill-[#22c55e]"
              onClick={shuffleTracks}
            />
          ) : (
            <TiArrowShuffle size={26} onClick={shuffleTracks} />
          )}
          <GiPreviousButton
            size={26}
            onClick={() => {
              changeTrack("previous");
            }}
          />
          {playerState ? (
            <FaCirclePause size={36} onClick={changeState} />
          ) : (
            <FaCirclePlay size={36} onClick={changeState} />
          )}
          <GiNextButton
            size={26}
            onClick={() => {
              changeTrack("next");
            }}
          />
          {repeatMode === "track" ? (
            <TbRepeatOnce
              size={26}
              onClick={handleRepeatButton}
              className="stroke-[#22c55e]"
            />
          ) : repeatMode === "context" ? (
            <TbRepeat
              size={26}
              onClick={handleRepeatButton}
              className="stroke-[#22c55e]"
            />
          ) : (
            <TbRepeat size={26} onClick={handleRepeatButton} />
          )}
        </div>
        <div>
          <div className="inline-flex gap-4">
            <p>
              {(currentProgressMS && formatDuration(currentProgressMS)) ||
                "00:00"}
            </p>
            <input
              type="range"
              min={0}
              className="rounded overflow-hidden appearance-none bg-zinc-400 mt-2 h-1 w-[400px]"
              max={currentTrack?.duration_ms}
              step={1}
              value={currentProgressMS}
              onChange={(e) => {
                seekToPosition(e.target.value);
              }}
              style={rangeFillStyle}
            />
            <p>
              {currentTrack?.duration_ms
                ? formatDuration(currentTrack.duration_ms)
                : "00:00"}
            </p>
          </div>
        </div>
      </div>
      <ExtraControlsUI player={mainPlayer} />
    </>
  );
});

export default PlayerControls;
