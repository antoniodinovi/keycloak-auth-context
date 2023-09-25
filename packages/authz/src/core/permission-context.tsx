import React, { useContext, useMemo } from "react";
import {
  FCC,
  PermissionContextProps,
  PermissionProviderProps,
  UsePermissionType,
} from "../types";
import { getPermissionSet } from "./utils";

const PermissionContext = React.createContext<PermissionContextProps>(null);

export const usePermissionContext = () => useContext(PermissionContext);

export const PermissionProvider: FCC<PermissionProviderProps> = (props) => {
  const { permissionToken, permissionPath, isDebug = false, children } = props;

  const permissionSet = React.useMemo(
    () => getPermissionSet(permissionToken, permissionPath, isDebug),
    [permissionToken, permissionPath, isDebug]
  );

  const provider = useMemo(
    () => (
      <PermissionContext.Provider
        value={{ permissionSet, options: { isDebug } }}
      >
        {children}
      </PermissionContext.Provider>
    ),
    [permissionSet, isDebug]
  );

  return provider;
};

export const usePermission: UsePermissionType = (permissionIds) => {
  const { permissionSet, options } = usePermissionContext();

  const can = React.useMemo(() => {
    const isTrue = permissionIds.every((perm) => permissionSet.has(perm));
    if (!isTrue && options?.isDebug) {
      permissionIds
        .filter((perm) => !permissionSet.has(perm))
        .forEach((perm) => console.warn("UNAUTHORIZED", perm));
    }

    return isTrue;
  }, [permissionIds, permissionSet]);

  return can;
};
