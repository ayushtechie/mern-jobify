import { Outlet, redirect, useLoaderData,useNavigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

import Wrapper from '../assets/wrappers/Dashboard';
import { Navbar, BigSidebar, SmallSidebar, Loading } from '../components';

const DashboardContext = createContext();


const userQuery = {
  queryKey: ['user'],
  queryFn: async () => {
    const { data } = await customFetch('/users/current-user');
    return data;
  },
};

export const loader = async (queryClient) => {
  try {
    return await queryClient.ensureQueryData(userQuery);
  } catch (error) {
    return redirect('/');
  }
};

const Dashboard = ({ prefersDarkMode, queryClient }) => {
  const { user } = useQuery(userQuery)?.data;
};

const DashboardLayout = ({ isDarkThemeEnabled }) => {
  const [isAuthError, setIsAuthError] = useState(false);

  const logoutUser = async () => {
    await customFetch.get('/auth/logout');
    toast.success('Logging out...');
    navigate('/');
  };

  customFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        setIsAuthError(true);
      }
      return Promise.reject(error);
    }
  );
  useEffect(() => {
    if (!isAuthError) return;
    logoutUser();
  }, [isAuthError]);

  const navigate = useNavigate();
  const {user} = useLoaderData();



  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled);

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme', newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme);
  };


  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // const logoutUser = async () => {
  //   navigate('/');
  //   await customFetch.get('/auth/logout');
  //   queryClient.invalidateQueries();
  //   toast.success('Logging out...');
  // };
  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className='dashboard'>
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className='dashboard-page'>
              {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;