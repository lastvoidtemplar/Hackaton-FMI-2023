import React from 'react'
import Landing from "./components/Landing"
import Home from "./components/Home"
import Callback from './Callback'
import { AuthGuard } from './components/AuthGuard'
import { Route, Routes } from "react-router-dom"
import Party from './components/Party'
import NotFound from './components/NotFound'

const MainRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<AuthGuard component={Home} />}/>
        <Route path="/callback" element={<Callback />}/>
        <Route path="/party/:party_id" element={<AuthGuard component={Party} />} />
        <Route path="*" element={<NotFound />} />
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