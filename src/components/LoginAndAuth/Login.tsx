// const BASE_AUTH = "https://accounts.spotify.com/authorize";
// const clientId = "7b98617f69ac4cbd8cb1609e2a80fb5b";
// const redirectURI = "http://localhost:5173/";
// const scopes = [
//   "streaming",
//   "user-read-email",
//   "user-read-private",
//   "user-read-currently-playing",
//   "user-read-playback-state",
//   "user-modify-playback-state",
//   "playlist-modify-public",
//   "playlist-read-private",
//   "user-library-modify",
//   "user-library-read",
//   "user-top-read",
//   "user-read-playback-position",
//   "user-read-recently-played",
// ];

// export const getTokenFromResponse = () => {
//   return window.location.hash
//     .substring(1)
//     .split("&")
//     .reduce((initial: Record<string, string>, item) => {
//       // #accessToken=mysecretkey&name=tushar
//       let parts = item.split("=");
//       initial[parts[0]] = decodeURIComponent(parts[1]);

//       return initial;
//     }, {});
// };

// export const getTokenFromResponse = () => {
//   const hash = window.location.hash;
//   let token;
//   if (hash) {
//     token = window.location.hash.substring(1).split("&")[0].split("=")[1];
//   }
//   return token;
// };

// const AUTH_URL = `${BASE_AUTH}?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scopes.join(
//   "%20"
// )}&response_type=token&show_dialog=true`;

export default function Login() {
  return (
    <div className="login text-center bg-stone-900 h-lvh bg-[url('./stars_space_glow_99744_1920x1080.jpg')] bg-cover bg-blend-overlay">
      <div className="grid place-items-center h-full">
        <div className="flex items-center mx-auto">
          <img src="./TuneStellar.png" className="w-80" alt="" />
          <h2 className="title-main text-8xl p-3 text-center">Tune Stellar</h2>
        </div>
        <div
          className="rounded-full text-xl relative bottom-36 p-5 bg-gradient-to-b from-green-500 to-emerald-900 cursor-pointer"
          onClick={() => {
            window.location.href =
              "https://tune-stellar-backend.vercel.app/login";
          }}
        >
          Please login with your Spotify account
        </div>
      </div>
    </div>
  );
}
