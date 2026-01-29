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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<void>;
  recoverPassword: (email: string) => Promise<void>;
  refreshCustomer: () => Promise<void>;
  updateProfile: (data: CustomerUpdateInput) => Promise<void>;
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

  // Load auth from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const { accessToken: storedToken, expiresAt }: StoredAuth = JSON.parse(stored);
          
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
              setAccessToken(null);
            }
          } else {
            // Token is expired, clear storage
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Failed to load stored auth:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Save auth to localStorage
  const saveAuth = useCallback((token: CustomerAccessToken) => {
    const stored: StoredAuth = {
      accessToken: token.accessToken,
      expiresAt: token.expiresAt,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));
    setAccessToken(token.accessToken);
  }, []);

  // Clear auth from localStorage
  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAccessToken(null);
    setCustomer(null);
  }, []);

  // Login
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const token = await customerAccessTokenCreate(email, password);
        saveAuth(token);

        const customerData = await getCustomer(token.accessToken);
        if (customerData) {
          setCustomer(customerData);
        } else {
          throw new Error("Failed to fetch customer data");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [saveAuth]
  );

  // Logout
  const logout = useCallback(async () => {
    if (accessToken) {
      try {
        await customerAccessTokenDelete(accessToken);
      } catch (error) {
        console.error("Failed to delete access token:", error);
      }
    }
    clearAuth();
  }, [accessToken, clearAuth]);

  // Register
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName?: string,
      lastName?: string
    ) => {
      setIsLoading(true);
      try {
        const { customer: newCustomer, customerAccessToken } = await customerCreate(
          email,
          password,
          firstName,
          lastName
        );
        saveAuth(customerAccessToken);
        setCustomer(newCustomer);
      } finally {
        setIsLoading(false);
      }
    },
    [saveAuth]
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

  // Update Profile
  const updateProfile = useCallback(
    async (data: CustomerUpdateInput) => {
      if (!accessToken) {
        throw new Error("Not authenticated");
      }

      const updatedCustomer = await customerUpdate(accessToken, data);
      setCustomer(updatedCustomer);
    },
    [accessToken]
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
