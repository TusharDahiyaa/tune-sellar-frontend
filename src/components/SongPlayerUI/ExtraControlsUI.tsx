/// <reference path="../styles.d.ts" />
import React, { useEffect, useState } from "react";
import { FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from "react-icons/fa6";
import { HiMiniQueueList } from "react-icons/hi2";
import { MdLyrics } from "react-icons/md";
import { TbDevices2 } from "react-icons/tb";
import { useContextValue } from "@/utils/ContextProvider";
import axios from "axios";
import { reducerCases } from "@/utils/Constants";
import { HiMiniComputerDesktop } from "react-icons/hi2";

const ExtraControlsUI = React.memo(({ player }: any) => {
  const [soundLevel, setSoundLevel] = useState(50);
  const [currentLevel, setCurrentLevel] = useState(50);
  const [{ token }, dispatch] = useContextValue();
  const [currentDevices, setCurrentDevices] = useState<any>();
  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false); // State to control menu visibility

  useEffect(() => {
    const updateVolume = async () => {
      // Update sound level when player volume changes
      const newVolume = await player.getVolume();
      setSoundLevel(newVolume * 100);
    };

    if (token != null) {
      updateVolume();
    }
  }, [soundLevel]);

  const setNewVolume = async (e: any) => {
    const volume = parseInt(e);
    setSoundLevel(volume); // Update sound level immediately
    player.setVolume(volume / 100);

    await axios.put(
      `https://api.spotify.com/v1/me/player/volume`,
      {},
      {
        params: {
          volume_percent: volume,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

  const handleVolumeIcon = () => {
    let volumeIcon;

    if (soundLevel > 50) {
      volumeIcon = (
        <FaVolumeHigh
          size={32}
          onClick={handleMute}
          className="cursor-pointer"
        />
      );
    } else if (soundLevel > 0 && soundLevel <= 50) {
      volumeIcon = (
        <FaVolumeLow
          size={24}
          onClick={handleMute}
          className="cursor-pointer"
        />
      );
    } else {
      volumeIcon = (
        <FaVolumeXmark
          size={28}
          onClick={handleMute}
          className="cursor-pointer"
        />
      );
    }
    return volumeIcon;
  };

  const handleMute = () => {
    if (soundLevel > 0) {
      setCurrentLevel(soundLevel);
      setSoundLevel(0);
      setNewVolume(0);
    } else {
      setSoundLevel(currentLevel);
      setNewVolume(currentLevel);
    }
  };

  const handleDevices = async () => {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/player/devices`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const devices = response.data.devices;
    setCurrentDevices(devices);
    setIsDeviceMenuOpen(!isDeviceMenuOpen);
  };

  const handleChangeDevice = async (deviceId: any) => {
    await axios.put(
      `https://api.spotify.com/v1/me/player`,
      {
        device_ids: [deviceId],
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

  const rangeFillStyle = {
    background: `linear-gradient(to right, #22c55e ${soundLevel}%, transparent ${soundLevel}%)`,
  };

  return (
    <div className="flex items-center gap-3">
      <MdLyrics
        size={30}
        className="cursor-pointer"
        onClick={() => {
          dispatch({
            type: reducerCases.SET_SELECTED_COMPONENT,
            selectedComponent: "Lyrics",
          });
        }}
      />
      <HiMiniQueueList
        size={30}
        className="cursor-pointer"
        onClick={() => {
          dispatch({
            type: reducerCases.SET_SELECTED_COMPONENT,
            selectedComponent: "Queue",
          });
        }}
      />
      <div className="relative">
        {isDeviceMenuOpen && (
          <ul className="absolute bottom-8 -left-10 mt-1 w-max bg-stone-800 rounded-xl shadow text-zinc-200">
            {currentDevices &&
              currentDevices.map((device: any) => {
                const activeDeviceColor = device.is_active ? "#22c55e" : "";
                return (
                  <li
                    key={device?.id}
                    className="px-2 py-2 cursor-pointer hover:bg-gray-500 rounded-xl text-sm"
                    style={{ backgroundColor: activeDeviceColor }}
                    onClick={() => {
                      device && handleChangeDevice(device?.id);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {device.type === "Computer" ? (
                        <HiMiniComputerDesktop />
                      ) : (
                        ""
                      )}
                      {device?.name}
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
        <TbDevices2
          size={20}
          onClick={handleDevices}
          className="cursor-pointer"
        />
      </div>
      {handleVolumeIcon()}
      <input
        type="range"
        min={0}
        id="volume"
        className="rounded overflow-hidden appearance-none bg-zinc-400 h-2 w-full"
        max={100}
        step={1}
        value={soundLevel}
        onInput={(e) => {
          setNewVolume((e.target as HTMLInputElement).value);
        }}
        style={rangeFillStyle}
      />
    </div>
  );
});

export default ExtraControlsUI;
