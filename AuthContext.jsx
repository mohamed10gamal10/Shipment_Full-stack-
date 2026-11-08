import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, customerApi } from "../api/services";
import { session } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => session.get()?.user || null);
  const [profile, setProfile] = useState(null);   // customer profile (customers only)
  const [ready, setReady] = useState(false);       // finished the first check?

  const loadProfile = useCallback(async (u) => {
    if (u?.role !== "customer") { setProfile(null); return null; }
    try {
      const p = await customerApi.me();
      setProfile(p);
      return p;
    } catch (err) {
      if (err.status === 404) { setProfile(null); return null; }
      throw err;
    }
  }, []);

  // On first load: if we have a token, confirm it and load the profile.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session.get()?.access) { setReady(true); return; }
      try {
        const me = await authApi.me();
        if (cancelled) return;
        session.set({ ...session.get(), user: me });
        setUser(me);
        await loadProfile(me);
      } catch (err) {
        if (err.status === 401 || err.status === 403) { session.clear(); setUser(null); }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, [loadProfile]);

  // The API client fires this event when the refresh token is no longer valid.
  useEffect(() => {
    const onLogout = () => { setUser(null); setProfile(null); };
    window.addEventListener("waybill:logout", onLogout);
    return () => window.removeEventListener("waybill:logout", onLogout);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    session.set({ access: data.access, refresh: data.refresh, user: data.user });
    setUser(data.user);
    await loadProfile(data.user);
    return data.user;
  }, [loadProfile]);

  const register = useCallback(async ({ username, email, password }) => {
    await authApi.register({ username, email, password });
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    session.clear();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({ user, profile, setProfile, ready, login, register, logout }),
    [user, profile, ready, login, register, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
