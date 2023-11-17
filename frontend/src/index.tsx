import { StrictMode } from 'react';
import { createRoot} from 'react-dom/client';
import { App } from './app';

import './index.css';

const root = createRoot(
    document.getElementById('root') as HTMLElement,
);

root.render(
    // <StrictMode>
        <App />
    // </StrictMode>,
);

const reportWebVitals = (onPerfEntry?: any) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import("web-vitals").then(
            ({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(onPerfEntry);
                getFID(onPerfEntry);
                getFCP(onPerfEntry);
                getLCP(onPerfEntry);
                getTTFB(onPerfEntry);
            },
        );
    }
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();