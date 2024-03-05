import { reducerCases } from "@/utils/Constants";
import { useContextValue } from "@/utils/ContextProvider";
import React from "react";

const HomePlaylistView = React.memo(({ playlist }: any) => {
  const [, dispatch] = useContextValue();
  return (
    <div
      className="w-40 p-2 cursor-pointer"
      onClick={() => {
        dispatch({
          type: reducerCases.SET_SELECTED_PLAYLIST_ID,
          selectedPlaylistId: playlist?.id,
        });
        dispatch({
          type: reducerCases.SET_SELECTED_COMPONENT,
          selectedComponent: `playlist/${playlist?.id}`,
        });
      }}
    >
      <div className="border-2 dark:border-zinc-700 rounded-lg overflow-hidden h-52 dark:bg-stone-950 light:bg-stone-200 light: border-zinc-300">
        <img
          src={playlist?.images[0]?.url}
          alt="playlist Img"
          className="rounded w-40 h-26"
        />
        <h2 className="text-center p-2">{playlist?.name}</h2>
      </div>
    </div>
  );
});

export default HomePlaylistView;
