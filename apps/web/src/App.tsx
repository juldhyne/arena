import "./App.css";
import AuthProvider from "./auth/AuthProvider";
import Home from "./auth/Home";
import SigninForm from "./auth/SigninForm";
import SignupForm from "./auth/SignupForm";
import CharactersList from "./characters/CharactersList";
import CharactersProvider from "./characters/CharactersProvider";
import Navbar from "./router/Navbar";
import NotFound from "./router/NotFound";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TeamsList from "./teams/TeamsList";
import TeamsProvider from "./teams/TeamsProvider";

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <CharactersProvider>
            <Navbar />
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SigninForm />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/characters" element={<CharactersList />} />
                <Route
                  path="/teams"
                  element={
                    <TeamsProvider>
                      <TeamsList />
                    </TeamsProvider>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </CharactersProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
