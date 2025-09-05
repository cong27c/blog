import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Provider as ReduxProvider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes, ScrollToTop, ErrorBoundary } from "./components";
import { store } from "./store/index.js";
import "./styles/index.scss";
import { fetchUserProfile } from "./features/auth/authAsync";
import { Toaster } from "react-hot-toast";
import usePusherNotifications from "./hooks/usePusherNotifications";
import { addNotification } from "./features/notification/notificationSlice";
import ChatbotWidget from "./components/ChatbotWidget/ChatbotWidget";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      try {
        const resultAction = await dispatch(fetchUserProfile());
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }

    fetchUser();
  }, [dispatch]);

  usePusherNotifications((notification) => {
    dispatch(addNotification(notification));
  });

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop>
          <AppRoutes />
          <ChatbotWidget />

          <Toaster position="top-right" reverseOrder={false} />
        </ScrollToTop>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
);
