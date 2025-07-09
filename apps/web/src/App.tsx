import "./App.css";
import AuthProvider from "./auth/AuthProvider";
import Home from "./auth/Home";
import SigninForm from "./auth/SigninForm";
import SignupForm from "./auth/SignupForm";
import Navbar from "./router/Navbar";
import NotFound from "./router/NotFound";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SigninForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
