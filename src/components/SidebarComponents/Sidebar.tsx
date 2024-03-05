import { GoHome } from "react-icons/go";
import { IoIosTrendingUp } from "react-icons/io";
import { useContextValue } from "@/utils/ContextProvider";
import UserPlaylists from "./UserPlaylists";
import { useEffect, useState } from "react";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { reducerCases } from "@/utils/Constants";
import { FaSearch } from "react-icons/fa";

export default function Sidebar() {
  const [{ playlists }, dispatch] = useContextValue();
  const [, setLoading] = useState(true);

  useEffect(() => {
    if (playlists) {
      setLoading(false);
      Loading.remove();
    } else {
      setLoading(true);
      Loading.pulse();
    }
  }, [playlists]);

  const handleSidebarClick = (componentName: any) => {
    dispatch({
      type: reducerCases.SET_SELECTED_COMPONENT,
      selectedComponent: componentName,
    });
  };

  return (
    <div className="w-[18%] pb-20 h-lvh m-[0.5] rounded-r-xl flex flex-col dark:text-zinc-200 dark:bg-gradient-to-b from-stone-900 to-stone-700 light:text-zinc-800 light: bg-zinc-100">
      <h2 className="title-main text-3xl pt-2 text-center mt-5 flex items-center">
        <img src="./TuneStellar.png" width={60} alt="" />
        Tune Stellar
      </h2>
      <div className="sidebar-main">
        <ul className="text-md mt-8">
          <li className="my-2 px-5 rounded">
            <a
              onClick={() => handleSidebarClick("HomePage")}
              className="transition-all ease-in-out hover:translate-x-2 cursor-pointer inline-flex items-center gap-2 hover:text-[#22c55e]"
            >
              <GoHome /> Home
            </a>
          </li>
          <li className="my-2 px-5 rounded">
            <a
              onClick={() => handleSidebarClick("SearchBox")}
              className="transition-all ease-in-out hover:translate-x-2 cursor-pointer inline-flex items-center gap-2 hover:text-[#22c55e]"
            >
              <FaSearch />
              Search
            </a>
          </li>
          {/* <li className="my-2 px-5 rounded">
            <a
              onClick={() => handleSidebarClick("Trending")}
              className="transition-all ease-in-out hover:translate-x-2 cursor-pointer inline-flex items-center gap-2 hover:text-[#22c55e]"
            >
              <IoIosTrendingUp />
              Trending
            </a>
          </li> */}
        </ul>
        <h2 className="mt-5 text-l w-full md:w-[90%] font-light px-5 tracking-widest border-5 py-1 light: bg-zinc-200 dark:bg-zinc-950 ">
          YOUR LIBRARY
        </h2>
        <ul className="text-sm">
          <li className="my-2 px-5 rounded">
            <a
              onClick={() => handleSidebarClick("RecentlyPlayed")}
              className="transition-all ease-in-out hover:translate-x-2 cursor-pointer "
            >
              Recently Played
            </a>
          </li>
          <li className="my-2 px-5 rounded">
            <a
              onClick={() => handleSidebarClick("LikedSongs")}
              className="transition-all ease-in-out hover:translate-x-2 cursor-pointer "
            >
              Liked Songs
            </a>
          </li>
        </ul>
        <h2 className="mt-5 text-l font-light px-5 w-full md:w-[90%] tracking-widest border-5 py-1 light: bg-zinc-200 dark:bg-zinc-950 ">
          PLAYLISTS
        </h2>
        <ul className="text-sm bg-opacity-30 dark:bg-stone-900  light:bg-zinc-300">
          <UserPlaylists />
        </ul>
      </div>
    </div>
  );
}
