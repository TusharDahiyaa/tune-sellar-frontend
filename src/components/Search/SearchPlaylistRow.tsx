import { reducerCases } from "@/utils/Constants";
import { useContextValue } from "@/utils/ContextProvider";

export default function SearchPlaylistRow({ playlist }: any) {
  const [, dispatch] = useContextValue();

  return (
    <div
      className="group cursor-pointer bg-gray-800 rounded-lg overflow-hidden relative transition duration-300 ease-in-out hover:shadow-md"
      onClick={() => {
        dispatch({
          type: reducerCases.SET_SELECTED_PLAYLIST_ID,
          selectedPlaylistId: playlist.id,
        });
        dispatch({
          type: reducerCases.SET_SELECTED_COMPONENT,
          selectedComponent: `playlist/${playlist.id}`,
        });
      }}
    >
      <img
        src={playlist?.images[0]?.url}
        alt=""
        className="w-full h-40 object-cover rounded-t-lg brightness-75 group-hover:brightness-50"
      />
      <div className="absolute inset-x-0 top-0 px-4 py-2 text-white text-sm">
        <h4 className="font-semibold">
          {playlist.name
            ? playlist.name.length > 25 // Adjust the length limit as needed
              ? playlist.name.slice(0, 25) + "..." // Truncate to 15 characters and add ellipsis
              : playlist.name // Display full name if it's within the limit
            : "Unnamed Playlist"}
        </h4>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-2 py-2 text-white text-sm flex justify-end">
        <p className="text-zinc-200 font-normal">
          {playlist.tracks.total || 0} songs
        </p>{" "}
      </div>
    </div>
  );
}
