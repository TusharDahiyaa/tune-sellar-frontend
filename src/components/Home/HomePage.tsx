import { reducerCases } from "@/utils/Constants";
import { useContextValue } from "@/utils/ContextProvider";
import axios from "axios";
import { useEffect, useRef, useCallback } from "react";
import HomePlaylistView from "./HomePlaylistView";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface PlaylistItem {
  id: string;
}

interface Playlist {
  message: string;
  playlists: {
    items: PlaylistItem[];
  };
}

interface Category {
  name: string;
  reducerType: string;
  playlistType: string;
}

const PlaylistContainer: React.FC<{
  playlist: Playlist | undefined;
  index: number;
  playlistContainerRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scrollLeft: (index: number) => void;
  scrollRight: (index: number) => void;
}> = ({ playlist, index, playlistContainerRefs, scrollLeft, scrollRight }) => {
  const playlistWidth = 160;

  return (
    <div key={index}>
      <h2 className="font-bold my-4 ms-4 text-2xl dark:text-zinc-300 light:text-zinc-800">
        {playlist?.message} Music
      </h2>
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => scrollLeft(index)}
          className="absolute left-0 top-8 flex items-center justify-center h-40 w-10 dark:bg-stone-800 light: bg-stone-400 bg-opacity-50 text-white hover:bg-opacity-75 rounded-r-md z-10"
        >
          <BsChevronLeft />
        </button>
        <div
          ref={(ref) => (playlistContainerRefs.current[index] = ref)}
          className="overflow-hidden grid grid-flow-col gap-3 h-60 mx-10"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {playlist?.playlists?.items?.map((currentPlaylist) => (
            <HomePlaylistView
              key={currentPlaylist.id + Math.random()}
              playlist={currentPlaylist}
              style={{ width: `${playlistWidth}px` }}
            />
          ))}
        </div>
        <button
          onClick={() => scrollRight(index)}
          className="absolute right-0 top-8 flex items-center justify-center h-40 w-10 dark:bg-stone-800 light: bg-stone-400 bg-opacity-50 text-white hover:bg-opacity-75 rounded-l-md z-10"
        >
          <BsChevronRight />
        </button>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [
    {
      token,
      popPlaylists,
      hipHopPlaylists,
      partyPlaylists,
      rockPlaylists,
      technoPlaylists,
      workoutPlaylists,
      indiePlaylists,
      moodPlaylists,
      studyPlaylists,
    },
    dispatch,
  ] = useContextValue();
  const playlistContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getMultiplePlaylists = useCallback(
    async (category: string, reducerType: string, playlistType: string) => {
      try {
        const response = await axios.get<Playlist>(
          `https://api.spotify.com/v1/browse/categories/${category}/playlists`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data !== null) {
          const playlists = response.data;
          dispatch({
            type: reducerType,
            [playlistType]: playlists,
          });
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    },
    [dispatch, token]
  );

  useEffect(() => {
    const categories: Category[] = [
      {
        name: "pop",
        reducerType: reducerCases.SET_POP_PLAYLISTS,
        playlistType: "popPlaylists",
      },
      {
        name: "hiphop",
        reducerType: reducerCases.SET_HIPHOP_PLAYLISTS,
        playlistType: "hipHopPlaylists",
      },
      {
        name: "party",
        reducerType: reducerCases.SET_PARTY_PLAYLISTS,
        playlistType: "partyPlaylists",
      },
      {
        name: "rock",
        reducerType: reducerCases.SET_ROCK_PLAYLISTS,
        playlistType: "rockPlaylists",
      },
      {
        name: "techno",
        reducerType: reducerCases.SET_TECHNO_PLAYLISTS,
        playlistType: "technoPlaylists",
      },
      {
        name: "workout",
        reducerType: reducerCases.SET_WORKOUT_PLAYLISTS,
        playlistType: "workoutPlaylists",
      },
      {
        name: "indie",
        reducerType: reducerCases.SET_INDIE_PLAYLISTS,
        playlistType: "indiePlaylists",
      },
      {
        name: "discover",
        reducerType: reducerCases.SET_DISCOVER_PLAYLIST,
        playlistType: "discoverPlaylist",
      },
      {
        name: "mood",
        reducerType: reducerCases.SET_MOOD_PLAYLISTS,
        playlistType: "moodPlaylists",
      },
      {
        name: "student",
        reducerType: reducerCases.SET_STUDY_PLAYLISTS,
        playlistType: "studyPlaylists",
      },
    ];

    if (token != null) {
      categories.forEach(({ name, reducerType, playlistType }) => {
        getMultiplePlaylists(name, reducerType, playlistType);
      });
    }
  }, [token, dispatch, getMultiplePlaylists]);

  const scrollLeft = useCallback((index: number) => {
    const containerRef = playlistContainerRefs.current[index];
    if (containerRef) {
      containerRef.scrollLeft -= 172; // Adjusted scrollAmount directly here
    }
  }, []);

  const scrollRight = useCallback((index: number) => {
    const containerRef = playlistContainerRefs.current[index];
    if (containerRef) {
      containerRef.scrollLeft += 172; // Adjusted scrollAmount directly here
    }
  }, []);

  const playlistArray: (Playlist | undefined)[] = [
    popPlaylists,
    hipHopPlaylists,
    partyPlaylists,
    rockPlaylists,
    technoPlaylists,
    workoutPlaylists,
    indiePlaylists,
    moodPlaylists,
    studyPlaylists,
  ];

  return (
    <div className="rounded-xl dark:bg-gradient-to-b from-stone-950 to-stone-900 dark:bg-opacity-60 mx-2 view-playlist light:bg-stone-200 light:text-zinc-800">
      {playlistArray.map((playlist, index) => (
        <PlaylistContainer
          key={index}
          index={index}
          playlist={playlist}
          playlistContainerRefs={playlistContainerRefs}
          scrollLeft={scrollLeft}
          scrollRight={scrollRight}
        />
      ))}
    </div>
  );
};

export default HomePage;
