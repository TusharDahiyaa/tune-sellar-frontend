import Sidebar from "./SidebarComponents/Sidebar";
import Navbar from "./Navbar";
import PlayerUI from "./SongPlayerUI/PlayerUI";
import RecommendedTracks from "./TrackView/RecommendedTracks";
import { useContextValue } from "@/utils/ContextProvider";
import HomePage from "./Home/HomePage";
import ViewPlaylist from "./PlaylistComponents/ViewPlaylist";
import RecentlyPlayed from "./Library/RecentlyPlayed";
import SearchBox from "./Search/SearchBox";
import ViewAlbum from "./AlbumComponent/ViewAlbum";
import ViewArtist from "./ArtistComponent/ViewArtist";
import LikedSongs from "./Library/LikedSongs";
import Queue from "./SongPlayerUI/Queue";
import React from "react";
import Lyrics from "./SongPlayerUI/Lyrics";

const AppWrapper = React.memo(() => {
  const [
    {
      selectedComponent,
      selectedPlaylistId,
      selectedAlbumId,
      selectedArtistId,
    },
  ] = useContextValue();

  const renderComponent = () => {
    switch (selectedComponent) {
      case "HomePage":
        return <HomePage />;
      case `playlist/${selectedPlaylistId}`:
        return <ViewPlaylist />;
      case `album/${selectedAlbumId}`:
        return <ViewAlbum />;
      case `artist/${selectedArtistId}`:
        return <ViewArtist />;
      case "RecentlyPlayed":
        return <RecentlyPlayed />;
      case "SearchBox":
        return <SearchBox />;
      case "LikedSongs":
        return <LikedSongs />;
      case "Queue":
        return <Queue />;
      case "Lyrics":
        return <Lyrics />;
      default:
        return null;
    }
  };

  return (
    <div
      id="mainBg"
      className="dark:bg-gradient-to-b from-[#1d1e2c] to-[#252422] light:bg-[#d6d3d1] h-lvh backdrop-blur-xl"
    >
      <div>
        <Sidebar />
      </div>
      <div className="absolute w-[62%] top-2 left-[18%] overflow-hidden">
        <Navbar />
      </div>
      <div className="absolute bottom-0 z-10">
        <PlayerUI />
      </div>
      <div className="absolute w-[20%] top-0 end-0">
        <RecommendedTracks />
      </div>
      <div className="absolute w-[62%] top-14 left-[18%]">
        {renderComponent()}
      </div>
    </div>
  );
});

export default AppWrapper;
