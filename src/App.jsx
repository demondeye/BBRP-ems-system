import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Desktop from './components/Desktop';
import WindowsStartup from './components/WindowsStartup';
import FirebaseLogin from './components/FirebaseLogin';
import LoginScreen from './components/LoginScreen';
import VicPolApp from './applications/vicpol-paperwork/VicPolApp';

function App() {
  const [user, setUser] = useState(null);
  const [showStartup, setShowStartup] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [openApplications, setOpenApplications] = useState([]);

  // Check for first visit and handle startup screen
  useEffect(() => {
    const hasVisited = localStorage.getItem('vicpol-has-visited');
    if (!hasVisited) {
      setShowStartup(true);
      localStorage.setItem('vicpol-has-visited', 'true');
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in, get their profile
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userProfile = {
            uid: firebaseUser.uid,
            email: userData.email,
            fullName: userData.fullName,
            rank: userData.rank,
            unit: userData.unit,
            division: userData.division
          };
          
          setUser(userProfile);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (userData) => {
    // Show login screen immediately
    setShowLoginScreen(true);
    
    // Minimum display time for login screen
    const minDisplayTime = new Promise(resolve => setTimeout(resolve, 2500));
    
    // Wait for both the minimum time and any async operations
    await minDisplayTime;
    
    // Hide login screen and show desktop
    setShowLoginScreen(false);
  };

  const handleOpenApp = (appId) => {
    // Check if app is already open
    const existingApp = openApplications.find(app => app.id === appId);
    
    if (existingApp) {
      // Bring to front / unminimize
      setOpenApplications(prev => 
        prev.map(app => 
          app.id === appId 
            ? { ...app, isMinimized: false, zIndex: Math.max(...prev.map(a => a.zIndex)) + 1 }
            : app
        )
      );
    } else {
      // Open new instance
      const newApp = {
        id: appId,
        name: appId === 'vicpol' ? 'VicPol Paperwork' : appId,
        icon: appId === 'vicpol' ? '📋' : '❓',
        isMinimized: false,
        zIndex: openApplications.length + 1
      };
      setOpenApplications(prev => [...prev, newApp]);
    }
  };

  const handleCloseApp = (appId) => {
    setOpenApplications(prev => prev.filter(app => app.id !== appId));
  };

  const handleCloseAllApps = () => {
    setOpenApplications([]);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setOpenApplications([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMinimizeApp = (appId) => {
    setOpenApplications(prev =>
      prev.map(app =>
        app.id === appId ? { ...app, isMinimized: !app.isMinimized } : app
      )
    );
  };

  // Show startup screen
  if (showStartup) {
    return (
      <WindowsStartup 
        onComplete={() => {
          setShowStartup(false);
        }} 
      />
    );
  }

  // Show login if no user
  if (!user) {
    return <FirebaseLogin onLogin={handleLogin} />;
  }

  // Show login screen (transition screen)
  if (showLoginScreen) {
    return <LoginScreen username={user.fullName} />;
  }

  // Show desktop with applications
  return (
    <>
      <Desktop 
        user={user}
        onOpenApp={handleOpenApp}
        openApplications={openApplications}
        onTaskbarAppClick={handleMinimizeApp}
        onCloseAllApps={handleCloseAllApps}
        onLogout={handleLogout}
      />

      {/* Render open applications */}
      {openApplications.map(app => {
        if (app.id === 'vicpol') {
          return (
            <VicPolApp
              key={app.id}
              user={user}
              onClose={() => handleCloseApp(app.id)}
              onMinimize={() => handleMinimizeApp(app.id)}
              isMinimized={app.isMinimized}
            />
          );
        }
        return null;
      })}
    </>
  );
}

export default App;
