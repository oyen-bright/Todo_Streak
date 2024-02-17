import { createBrowserRouter } from "react-router-dom";

import Home from '../pages/Home';

import Settings from '../pages/Settings';
import Layout from "../components/layout";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/settings",
                element: <Settings />
            }
        ]
    }
]);

export default router;
