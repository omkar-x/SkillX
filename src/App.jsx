import { Toaster } from "react-hot-toast"
import { Web3Provider } from "./contexts/Web3Context"
import Navbar from "./components/Navbar"

function App({ children }) {
  return (
    <Web3Provider>
      <div className="min-h-screen">
        <Navbar />
        <main className="container py-8">
          {children}
        </main>
        <Toaster position="top-right" />
      </div>
    </Web3Provider>
  )
}

export default App

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { Toaster } from "react-hot-toast"
// import { Web3Provider } from "./contexts/Web3Context"
// import Navbar from "./components/Navbar"
// import Home from "./pages/Home"
// import MintSkill from "./pages/MintSkill"
// import Marketplace from "./pages/Marketplace"
// import MySkills from "./pages/MySkills"


// function App() {
//   return (
//     <Web3Provider>
//       <Router>
//         <div className="min-h-screen">
//           <Navbar />
//           <main className="container py-8">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/mint" element={<MintSkill />} />
//               <Route path="/marketplace" element={<Marketplace />} />
//               <Route path="/my-skills" element={<MySkills />} />
//             </Routes>
//           </main>
//           <Toaster position="top-right" />
//         </div>
//       </Router>
//     </Web3Provider>
//   )
// }

// export default App
