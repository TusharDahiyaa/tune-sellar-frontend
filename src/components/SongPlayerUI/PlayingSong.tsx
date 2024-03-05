import { useContextValue } from "@/utils/ContextProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

export default function PlayingSong({ currentSong }: any) {
  const [{ token }, dispatch] = useContextValue();
  const [likedSong, setLikedSong] = useState<boolean>();

  useEffect(() => {
    const checkLikedSong = async () => {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/tracks/contains?ids=${currentSong?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data[0] === false) {
        setLikedSong(false);
      } else {
        setLikedSong(true);
      }
    };

    if (token !== null) {
      checkLikedSong();
    }
  }, [token, dispatch, currentSong]);

  const addToLikedSongs = async (currentSongId: string) => {
    const response = await axios.put(
      `https://api.spotify.com/v1/me/tracks?ids=${currentSongId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      setLikedSong(true);
    }
  };

  const removeLikedSong = async (currentSongId: string) => {
    const response = await axios.delete(
      `https://api.spotify.com/v1/me/tracks?ids=${currentSongId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      setLikedSong(false);
    }
  };

  return (
    <>
      <div className="inline-flex items-center gap-2 w-80">
        <img
          src={currentSong?.album?.images[0]?.url}
          width={60}
          height={60}
          alt=""
          className="rounded"
        />
        <div className="me-2">
          <h2 className="font-mono text-sm text-nowrap overflow-hidden overflow-ellipsis max-w-52">
            {currentSong?.name}
          </h2>
          <p className="font-mono text-sm text-nowrap overflow-hidden overflow-ellipsis max-w-52">
            {currentSong?.artists?.map((artist: any) => artist.name).join(", ")}
          </p>
        </div>
        {likedSong ? (
          <FaHeart
            size={26}
            className="stroke-[#22c55e] stroke-1 fill-[#22c55e] cursor-pointer"
            onClick={() => {
              removeLikedSong(currentSong?.id);
            }}
          />
        ) : (
          <FaRegHeart
            size={26}
            className="stroke-gray-300 stroke-1 cursor-pointer"
            onClick={() => {
              addToLikedSongs(currentSong?.id);
            }}
          />
        )}
      </div>
    </>
  );
}
