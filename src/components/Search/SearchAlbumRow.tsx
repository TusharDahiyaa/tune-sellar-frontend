import { useContextValue } from "@/utils/ContextProvider";
import { reducerCases } from "@/utils/Constants";

export default function SearchAlbumRow({ album }: any) {
  const [, dispatch] = useContextValue();

  return (
    <div
      className="relative w-40 h-40 py-2 shadow rounded-lg bg-stone-900 bg-opacity-40 hover:bg-opacity-60 dark:bg-stone-300 dark:bg-opacity-30 hover:dark:bg-opacity-50 cursor-pointer overflow-hidden light: text-zinc-200"
      onClick={() => {
        dispatch({
          type: reducerCases.SET_SELECTED_ALBUM_ID,
          selectedAlbumId: album.id,
        });
        dispatch({
          type: reducerCases.SET_SELECTED_COMPONENT,
          selectedComponent: `album/${album?.id}`,
        });
      }}
    >
      {album.name ? (
        <img
          src={album.images[1].url}
          alt="Album Cover"
          className="w-48 h-48 object-cover rounded-lg brightness-50"
        />
      ) : (
        <img
          src="https://picsum.photos/200/?grayscale&blur=10"
          alt=""
          className="w-48 h-48 object-cover rounded-lg brightness-50"
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-lg font-medium">{album.name ? album.name : ""}</p>
        <p className="text-sm text-stone-400">
          {album.artists.map((artist: any) => artist.name).join(", ")}
        </p>
      </div>
    </div>
  );
}
