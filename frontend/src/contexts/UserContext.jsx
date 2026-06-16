import React, {
  createContext,
  useState,
  useEffect,
} from "react";
import api from "@/app/axios";

export const UserContext =
  createContext({
    user: null,
    setUser: () => { },
    refreshUser: () => { },
    loading: true,
  });

export const UserProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(() => {
      try {
        const stored =
          localStorage.getItem(
            "user"
          );

        return stored
          ? JSON.parse(
            stored
          )
          : null;
      } catch {
        return null;
      }
    });

  const [loading, setLoading] =
    useState(true);

  const refreshUser =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          setUser(null);
          return;
        }

        const { data } =
          await api.get(
            "/auth/profile"
          );

        if (
          data.success
        ) {
          setUser(
            data.data
          );

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.data
            )
          );
        }
      } catch (error) {
        console.log(
          "Profile refresh failed",
          error
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(
          user
        )
      );
    } else {
      localStorage.removeItem(
        "user"
      );
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};