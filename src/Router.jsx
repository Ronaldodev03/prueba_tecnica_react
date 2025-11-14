import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BooksPage from "./pages/BooksPage";
import BooksPagePro from "./pages/BooksPagePro";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/books-pro" element={<BooksPagePro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
