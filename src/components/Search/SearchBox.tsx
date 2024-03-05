import { Input } from "@/components/ui/input";
import { reducerCases } from "@/utils/Constants";
import { useContextValue } from "@/utils/ContextProvider";
import axios from "axios";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import SearchSongRow from "./SearchSongRow";
import SearchAlbumRow from "./SearchAlbumRow";
import SearchPlaylistRow from "./SearchPlaylistRow";
import SearchArtistRow from "./SearchArtistRow";

export default function SearchBox() {
  const [
    {
      token,
      searchedAlbums,
      searchedTracks,
      searchedPlaylists,
      searchedArtists,
    },
    dispatch,
  ] = useContextValue();
  const [searchValue, setSearchValue] = useState("");
  let timeout: NodeJS.Timeout;

  const getSearched = async (e: string) => {
    if (!token) return;
    try {
      const searchQuery = e.split("%20").join("%20"); // Converts the URL encoded spaces to normal ones for searching
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${searchQuery}&type=track,artist,album,playlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { albums, artists, playlists, tracks } = response.data;
      if (response.data !== "") {
        dispatch({
          type: reducerCases.SET_SEARCHED_TRACKS,
          searchedTracks: tracks,
        });
        dispatch({
          type: reducerCases.SET_SEARCHED_ARTISTS,
          searchedArtists: artists,
        });
        dispatch({
          type: reducerCases.SET_SEARCHED_ALBUMS,
          searchedAlbums: albums,
        });
        dispatch({
          type: reducerCases.SET_SEARCHED_PLAYLISTS,
          searchedPlaylists: playlists,
        });
      }
    } catch (err) {
      console.log("Error in getting search results");
      setSearchValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      getSearched(e.target.value);
    }, 1000);
  };

  return (
    <div className="rounded-xl dark:bg-gradient-to-b from-zinc-900 to-stone-700 dark:bg-opacity-60 mx-2 view-playlist light:bg-stone-200 light:text-zinc-800 ">
      <form
        className="w-[100%] mx-auto m-2 px-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="default-search" className="sr-only">
          Search
        </label>
        <div className="flex items-center gap-2 fixed w-[60%] light: text-gray-800 dark:text-gray-400 z-50">
          <FaSearch className=" absolute ms-3" />
          <Input
            placeholder="Search music, playlist, album.."
            id="default-search"
            className="ps-10 rounded-full light: border-stone-800 dark:border-stone-500"
            autoComplete="off"
            value={searchValue}
            onInput={handleInputChange}
          />
        </div>
      </form>
      {searchValue === "" ? (
        <div className="flex items-center px-2 py-16 m-2">
          <FaSearch size={50} className="animate-bounce" />
          <h1 className="font-semibold text-lg md:text-xl lg:text-2xl xl:text-3xl mx-5">
            Start typing to search for something...
          </h1>
        </div>
      ) : (
        <div className="px-2 pt-12 my-2">
          <h1 className="font-semibold text-lg md:text-xl lg:text-2xl xl:text-4xl">
            Results
          </h1>
          <div className="">
            <h2 className="text-2xl mb-2 font-semibold py-2">Songs</h2>
            <div className="h-80 searchTrack">
              {searchedTracks?.items?.map((track: any) => (
                <SearchSongRow key={track.id} track={track} />
              ))}
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-semibold py-2">Artists</h2>
            <div className="h-80 searchTrack bg-opacity-40">
              <div className="grid grid-rows-4 grid-flow-col gap-2 justify-between">
                {searchedArtists?.items?.map((artist: any) => (
                  <SearchArtistRow key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-semibold py-2">Playlists</h2>
            <div className="h-80 searchTrack bg-opacity-40">
              <div className="grid grid-cols-6 grid-flow-row gap-2 justify-between">
                {searchedPlaylists?.items?.map((playlist: any) => (
                  <SearchPlaylistRow key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-2xl font-semibold py-2">Albums</h2>
            <div className="h-80 searchTrack bg-opacity-40">
              <div className="grid grid-rows-4 grid-flow-col gap-2 justify-between">
                {searchedAlbums?.items?.map((album: any) => (
                  <SearchAlbumRow key={album.id} album={album} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
