import React, { useState } from "react";
import LogIn from "../components/LogIn.jsx";
import SignUp from "../components/SignUp.jsx";
import NavBar from "../components/NavBar.jsx";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
           
            <NavBar name="Back" path="/"/>

            
            <div className="mt-20">
                {isLogin ? <LogIn setIsLogin={setIsLogin} /> : <SignUp setIsLogin={setIsLogin} />}
            </div>
        </div>
    );
};

export default AuthPage;
