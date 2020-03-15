import React from "react";
import { BrowserRouter, Switch, Redirect, Route, Link } from "react-router-dom";
import { Icon } from "rsuite";
import { motion } from "framer-motion";

import "rsuite/dist/styles/rsuite-default.css";
import "./App.css";
import logo from "./assets/img/logo.png";

import { DashboardPage } from "./pages/DashboardPage";
import { CreatePage } from "./pages/CreatePage";

const App = () => {
    return (
        <BrowserRouter>
            <div id="main">
                <div id="main-wrapper">
                    <motion.div id="main-sidebar"
                        initial="hidden"
                        animate="visible"
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    >
                        <Link to="/">
                            <motion.img id="main-logo" src={logo} alt="logo"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }} />
                            <h1>keycap</h1>
                        </Link>
                        <div id="main-sidebar-items">
                            <ul>
                                <Link to="/play">
                                    <li>
                                        <Icon icon="gamepad" />
                                        <h6>play</h6>
                                    </li>
                                </Link>
                                <Link to="/create">
                                    <li>
                                        <Icon icon="plus-square" />
                                        <h6>create</h6>
                                    </li>
                                </Link>
                            </ul>
                        </div>
                        <footer>
                            created by 
                            <a href="https://github.com/adrianplavka" target="_blank" rel="noopener noreferrer">
                                <Icon icon="github" /> Adrian Plavka
                            </a>
                            <br />
                            for educational purposes (FRI JCN)
                        </footer>
                    </motion.div>

                    <div id="main-content">
                        <Switch>
                            <Route exact path="/">
                                <DashboardPage />
                            </Route>
                            <Route path="/play">
                                Play
                            </Route>
                            <Route exact path="/create">
                                <CreatePage />
                            </Route>
                            <Route path="*">
                                <Redirect to="/" />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        </BrowserRouter>
  );
}

export default App;