import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Petitions from "./components/Petitions";
import Petition from "./components/Petition";
import NotFound from "./components/NotFound";
import PetitionList from './components/PetitionList';
import Login  from './components/Login';
import Register from './components/Register';

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
// import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import MyPetitions from './components/MyPetitions';
import CreatePetition from './components/CreatePetition';
import { SnackbarProvider } from 'notistack';

// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.


function App() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
          // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
          // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
          // starting from v2 you can add only the features you need reducing the bundle size
          //await loadAll(engine);
          //await loadFull(engine);
          await loadSlim(engine);
          //await loadBasic(engine);
        }).then(() => {
          setInit(true);
        });
      }, []);

      const particlesLoaded = async (container?: Container): Promise<void> => {
        console.log(container);
      };


      const options: ISourceOptions = useMemo(
        () => ({
          background: {
            color: {
              value: "#ADD8E6",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
            },
            modes: {
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#f5979d",
            },
            move: {
              direction: MoveDirection.none,
              enable: true,
              outModes: {
                default: OutMode.out,
              },
              random: false,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 10,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 50, max: 200 },
            },
          },
          detectRetina: true,
        }),
        [],
      );



    return (
    <div className="App">

      <Router>

        <Navbar/>

        <div style={{minHeight:"100%", alignItems:"center"}}>
        <SnackbarProvider maxSnack={3}>
        <Routes>
            <Route path="/petitions" element={<PetitionList/>}/>
            <Route path="/petitions/:id" element={<Petition/>}/>
            <Route path="/petitions-props" element={<PetitionList/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/MyPetitions" element={<MyPetitions/>}/>
            <Route path="/CreatePetition" element={<CreatePetition/>}/>

            <Route path="/" element={<Home/>}/>
  

            <Route path="*" element={<NotFound/>}/>

        </Routes>
        </SnackbarProvider>
        </div>
        <Particles style={{zIndex:"-100"}}options={options} particlesLoaded={particlesLoaded} />;

      </Router>
    </div>
    );
}

export default App;