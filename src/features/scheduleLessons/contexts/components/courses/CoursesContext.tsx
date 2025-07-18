import { createContext } from "react";
import type { CoursesContextType } from "./CoursesProvider";

export const CoursesContext = createContext<CoursesContextType | undefined>(undefined);