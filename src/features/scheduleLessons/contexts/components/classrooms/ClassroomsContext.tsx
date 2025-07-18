import { createContext } from "react";
import type { ClassroomsContextType } from "./ClassroomsProvider";

export const ClassroomsContext = createContext<ClassroomsContextType | undefined>(undefined);