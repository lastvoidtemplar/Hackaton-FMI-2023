import React from 'react'
import Landing from "./components/Landing"
import Home from "./components/Home"
import Callback from './Callback'
import { AuthGuard } from './components/AuthGuard'
import { Route, Routes } from "react-router-dom"

const MainRoutes = () => {
    return (
        <main>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<AuthGuard component={Home} />}/>
        <Route path="/callback" element={<Callback />}/>
        {/* "/" -> <Home />
            "/vote" -> <VotingPoll> 
            "/login" -> <ButtonLogIn>
            "/signup" -> <ButtonSignUp>
            "/startparty -> <StartPartyForm>"
            

            Additional components:
              Voting button
              Music card display
              Search bar for music?
              Navbar/Header
              Buttons
              Footer
              AddSongButton
              HeadingComponent with prop as size
              
        */}
      </Routes>
    </main>

)
}

export default MainRoutes;



// export const router = createBrowserRouter(
//     createRoutesFromElements(
//       <Route path="/" element={<Home />}>
//      </Route>
//     )
//   );
    {/* <Route path="dashboard" element={<Dashboard />} />
//         <Route path="about" element={<About />} /> */}
//      