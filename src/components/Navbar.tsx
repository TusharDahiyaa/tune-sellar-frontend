import { ModeToggle } from "./mode-toggle";
import { useContextValue } from "@/utils/ContextProvider";
import { useEffect } from "react";
import axios from "axios";
import { reducerCases } from "@/utils/Constants";

export default function Navbar() {
  const [{ user, token }, dispatch] = useContextValue();
  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const user = response.data;
      dispatch({ type: reducerCases.SET_USER, user });
    };

    if (token != null) {
      getUserData();
    }
  }, [dispatch, token]);

  const formatTime = (time: number): string => {
    const date = new Date(time * 1000); // Convert milliseconds to Date object

    // Calculate hours in 24-hour format
    const hours = date.getHours() % 24;

    switch (hours) {
      case 21: // 9 PM
      case 22: // 10 PM
      case 23: //11 PM
      case 0: // Midnight
      case 1: // 1 AM
      case 2: // 2 AM
      case 3: // 3 AM
        return "Good Night, ";
      case 4: // 4 AM
      case 5: // 5 AM
      case 6: // 6 AM
      case 7: // 7 AM
      case 8: // 8 AM
      case 9: // 9 AM
      case 10: // 10 AM
      case 11: // 11 AM
        return "Good Morning, ";
      case 12: // Noon
      case 13: // 1 PM
      case 14: // 2 PM
      case 15: // 3 PM
      case 16: // 4 PM
      case 17: // 5 PM
        return "Good Afternoon, ";
      default: // Evening
        return "Good Evening, ";
    }
  };

  const currentTime = Date.now(); // Getting current timestamp in milliseconds

  return (
    <>
      <nav className="px-2 flex gap-1 justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold dark:text-zinc-200 light: text-zinc-900 px-2">
            {formatTime(currentTime / 1000)}
          </h1>
          <h2 className="py-1 text-2xl dark:text-zinc-200 light: text-zinc-900">
            {user && user.display_name}
          </h2>
        </div>
        <ModeToggle />
      </nav>
    </>
  );
}
