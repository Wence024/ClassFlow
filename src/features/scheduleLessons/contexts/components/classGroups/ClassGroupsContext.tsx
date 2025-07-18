import { createContext } from "react";
import type { ClassGroupsContextType } from "./ClassGroupsProvider";

export const ClassGroupsContext = createContext<ClassGroupsContextType | undefined>(undefined);
