import React, { useEffect } from "react";
import { url } from "../../Global/URL";
function navigate(url){
    window.location.href = url;
}

async function auth() {
    navigate(url + '/login');
}

const Login = () => {

    useEffect(()=>{
        let item = localStorage.getItem('IMPaccessToken');
        if (item) {
            window.location.href = `/redirection/${item}`;
        }
    }, [])
    return (
        <div>
            <div className="w-full h-16 flex">
                <div className="w-1/5 bg-red-600"></div>
                <div className="w-4/5 bg-red-800"></div>
            </div>
            <div className='w-full h-screen flex items-start'>
                <div className='relative w-1/2 h-full flex-col sm:block hidden'>
                    <img alt= '' src={require('../../assets/images/login_cover.png')} className="w-full h-full object-cover" />
                </div>

                <div className="w-full sm:w-1/2 h-full bg-[#f5f5f5]">
                    <div className="w-full h-12 flex">
                        <div className="w-5/6 white"></div>
                        <div className="w-1/6 bg-red-800"></div>
                    </div>
                    <div className='bg-[#f5f5f5] flex flex-col p-20 items-center'>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="max-w-full h-auto sm:max-w-[50%]">
                                <img
                                src={require('../../assets/images/somaiya-vidyavihar-brand.png')}
                                alt=""
                                className="max-w-full h-auto sm:max-w-full sm:max-h-20 object-contain"
                                />
                            </div>
                            <div className="max-w-full h-auto sm:max-w-[50%]">
                                <img
                                src={require('../../assets/images/somaiya-university-logo.png')}
                                alt=""
                                className="max-w-full h-auto sm:max-w-full sm:max-h-20 object-contain"
                                />
                            </div>
                        </div>
                        <div className='w-full flex flex-col items-center pt-8 pb-4'>
                            <h3 className='text-2xl font-semibold mb-4 text-center'>Welcome to Somaiya Internship Portal</h3>
                            <p className='text-sm mb-2 text-center'>Please Login through Google to continue</p>
                        </div>
                        <button type='button' onClick={()=> auth()} className='w-full text-[#060606] my-2 front-semibold bg-white border-2 border-black rounded-md p-4 text-center flex items-center justify-center'>
                            <img src={require('../../assets/images/google_icon.png')} alt='' className="h-6 mr-2"/>
                            Login with Somaiya Email ID 
                        </button>
                    </div>
                    <div className="fixed bottom-0 right-0 p-4 z-50">
                        <img
                            src={require('../../assets/images/Somaiya-Trust-Logo-01.png')}
                            alt=''
                            className='max-w-full max-h-20 object-contain'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;