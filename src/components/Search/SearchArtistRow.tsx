import { reducerCases } from "@/utils/Constants";
import { useContextValue } from "@/utils/ContextProvider";

export default function SearchArtistRow({ artist }: any) {
  const [, dispatch] = useContextValue();

  return (
    <div className="text-sm relative w-40">
      <div className="cursor-pointer rounded-lg dark:bg-stone-900 hover:bg-stone-700 transition duration-300 ease-in-out shadow-lg p-2">
        <div className="flex items-center justify-center mb-2">
          <img
            src={artist?.images[1]?.url}
            alt=""
            className="w-28 h-28 rounded-full"
          />
        </div>
        <h4 className="text-md font-semibold text-center truncate">
          {artist.name}
        </h4>
      </div>
      <div
        className="absolute inset-0 bg-black opacity-0 hover:opacity-50 rounded-lg transition duration-300 ease-in-out cursor-pointer"
        onClick={() => {
          dispatch({
            type: reducerCases.SET_SELECTED_ARTIST_ID,
            selectedArtistId: artist.id,
          });
          dispatch({
            type: reducerCases.SET_SELECTED_COMPONENT,
            selectedComponent: `artist/${artist?.id}`,
          });
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">
          View Artist
        </div>
      </div>
    </div>
  );
}
