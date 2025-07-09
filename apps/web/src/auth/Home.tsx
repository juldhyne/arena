import { useAuth } from "./AuthProvider";

const Home = () => {
  const { user, onSessionClosed } = useAuth();

  const handleLogout = () => {
    onSessionClosed();
  };

  return (
    <div>
      <h1>Welcome to the App</h1>
      {user ? (
        <>
          <p>
            Logged in as <strong>{user.username}</strong>
          </p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Home;
