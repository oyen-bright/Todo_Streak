import { useLocation, Outlet, RouterProvider, createBrowserRouter  } from "react-router-dom";
import {useEffect} from "react"

import Home from './pages/home';
import Settings from './pages/settings';
function App() {

    const Layout = () => {
        const path = useLocation().pathname;

        useEffect(() => {
            window.scrollTo(0,0)
        }, [path])

        return (
            <Outlet />
        )
    }


    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/",
                    element:<Home/>
                }, 
                {
                    path: "/settings",
                    element:<Settings/>
                }
            ]
        }

        
    ])

    return <RouterProvider router={router} />;
  
}


export default App