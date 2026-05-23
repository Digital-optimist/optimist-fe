"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  customerAccessTokenCreate,
  customerAccessTokenDelete,
  customerCreate,
  customerRecover,
  customerUpdate,
  getCustomer,
  type Customer,
  type CustomerAccessToken,
  type CustomerUpdateInput,
} from "@/lib/shopify";

// =============================================================================
// Types
// =============================================================================

interface AuthState {
  customer: Customer | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<{ verificationRequired: boolean }>;
  recoverPassword: (email: string) => Promise<void>;
  refreshCustomer: () => Promise<void>;
  updateProfile: (data: CustomerUpdateInput) => Promise<void>;
  setAuthFromToken: (token: CustomerAccessToken) => Promise<void>;
}

// =============================================================================
// Constants
// =============================================================================

const AUTH_STORAGE_KEY = "optimist_auth";

interface StoredAuth {
  accessToken: string;
  expiresAt: string;
}

// =============================================================================
// Context
// =============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

// =============================================================================
// Provider Component
// =============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!accessToken && !!customer;

  // Load auth from storage on mount. Checks localStorage first (persistent,
  // "remember me" enabled) then sessionStorage (session-only).
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const stored =
          localStorage.getItem(AUTH_STORAGE_KEY) ??
          sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const { accessToken: storedToken, expiresAt }: StoredAuth =
            JSON.parse(stored);

          // Check if token is expired
          if (new Date(expiresAt) > new Date()) {
            setAccessToken(storedToken);

            // Fetch customer data
            const customerData = await getCustomer(storedToken);
            if (customerData) {
              setCustomer(customerData);
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem(AUTH_STORAGE_KEY);
              sessionStorage.removeItem(AUTH_STORAGE_KEY);
              setAccessToken(null);
            }
          } else {
            // Token is expired, clear storage
            localStorage.removeItem(AUTH_STORAGE_KEY);
            sessionStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Save auth to storage. rememberMe=true → localStorage (persists across
  // browser restarts); rememberMe=false → sessionStorage (cleared on close).
  const saveAuth = useCallback(
    (token: CustomerAccessToken, rememberMe: boolean = true) => {
      const stored: StoredAuth = {
        accessToken: token.accessToken,
        expiresAt: token.expiresAt,
      };
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));
      setAccessToken(token.accessToken);
    },
    [],
  );

  // Clear auth from both storages
  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAccessToken(null);
    setCustomer(null);
  }, []);

  // Login. isLoading is intentionally NOT toggled here — that flag drives the
  // app-wide initial loading screen and toggling it mid-submit would unmount
  // the login form.
  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean = true) => {
      const token = await customerAccessTokenCreate(email, password);
      saveAuth(token, rememberMe);

      try {
        const customerData = await getCustomer(token.accessToken);
        if (customerData) {
          setCustomer(customerData);
        } else {
          throw new Error("Failed to fetch customer data");
        }
      } catch (error) {
        clearAuth();
        throw error;
      }
    },
    [saveAuth, clearAuth],
  );

  // Logout
  const logout = useCallback(async () => {
    if (accessToken) {
      try {
        await customerAccessTokenDelete(accessToken);
      } catch (error) {
        console.error("Failed to delete Shopify access token:", error);
      }
    }
    clearAuth();
  }, [accessToken, clearAuth]);

  // Register. Returns verificationRequired:true when the store has email
  // verification enabled — the customer is created but auto-login fails until
  // the user clicks the activation link.
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName?: string,
      lastName?: string,
    ): Promise<{ verificationRequired: boolean }> => {
      const { customer: newCustomer, customerAccessToken } =
        await customerCreate(email, password, firstName, lastName);

      if (!customerAccessToken) {
        return { verificationRequired: true };
      }

      saveAuth(customerAccessToken);
      setCustomer(newCustomer);
      return { verificationRequired: false };
    },
    [saveAuth],
  );

  // Recover Password
  const recoverPassword = useCallback(async (email: string) => {
    await customerRecover(email);
  }, []);

  // Refresh Customer
  const refreshCustomer = useCallback(async () => {
    if (!accessToken) return;

    try {
      const customerData = await getCustomer(accessToken);
      if (customerData) {
        setCustomer(customerData);
      }
    } catch (error) {
      console.error("Failed to refresh customer:", error);
    }
  }, [accessToken]);

  // Set auth from an externally-obtained access token (e.g. after a successful
  // password reset). Persists to localStorage so the session sticks.
  const setAuthFromToken = useCallback(
    async (token: CustomerAccessToken) => {
      saveAuth(token);
      const customerData = await getCustomer(token.accessToken);
      if (customerData) {
        setCustomer(customerData);
      }
    },
    [saveAuth],
  );

  // Update Profile
  const updateProfile = useCallback(
    async (data: CustomerUpdateInput) => {
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      const updatedCustomer = await customerUpdate(accessToken, data);
      setCustomer(updatedCustomer);
    },
    [accessToken],
  );

  return (
    <AuthContext.Provider
      value={{
        customer,
        accessToken,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
        recoverPassword,
        refreshCustomer,
        updateProfile,
        setAuthFromToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
