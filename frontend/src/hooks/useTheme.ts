import { useContext } from "react";
import { ThemeContext } from "../context/theme/ThemeContext.tsx";

const useTheme = () => useContext(ThemeContext)!;
export default useTheme;