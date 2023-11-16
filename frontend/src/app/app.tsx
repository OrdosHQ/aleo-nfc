import React, { FC, useState } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { Auth, Home, Mint, Scan } from '../pages';
import { Navbar } from '../widgets';
import { Routes, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import './app.css';

export const App: FC = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <NextUIProvider>
                    <main className="dark text-foreground bg-background">
                        <Navbar />
                        <div className="container px-6">
                            <Routes>
                                <Route path="/mint" element={<Mint />} />
                                <Route path="/scan" element={<Scan />} />
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/auth/twitter"
                                    element={<Auth />}
                                />
                            </Routes>
                        </div>
                    </main>
                </NextUIProvider>
            </BrowserRouter>
        </div>
    );
};
