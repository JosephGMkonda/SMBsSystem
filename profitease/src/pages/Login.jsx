
import React, {useEffect, useState} from 'react'
import { BsFillPersonFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import api from '../services/Api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN,REFRESH_TOKEN } from '../services/Constant';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'


const Login = () => {

    const [isLoading, setIsloading] = useState(false)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const [errors, setErrors] = useState({});


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    }


    const validationForm = () => {
        let formError = {};

        if(!formData.username){
            formError.username = "Username is required"
        }

        if(!formData.password){
            formError.password = "Password is required"
        }

        return formError;
    }

    const handleSubmit = async (e) => {
        setIsloading(true);

        e.preventDefault();

        const formError = validationForm();

        if(Object.keys(formError).length === 0){
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/token/',{
                    username: formData.username,
                    password: formData.password
                })
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                localStorage.setItem(REFRESH_TOKEN, response.data.access)
                console.log("Token stored, navigating to home page...");
                navigate('/')
            }catch(error){

                toast.error("Login failed. Please check your credentials and try again.");

            } finally{
                setIsloading(false)
            }
        } else{
            setErrors(formError);
        }


    }




    return (
    
        <div className="flex justify-center items-center h-screen">
            <div className="w-96 p-6 shadow-lg bg-white rounded-md">

                <div className="flex justify-center mb-6">
                    <h1 className="text-blue-500 text-3xl font-semibold">Profit Ease</h1>

                </div>

                {/* form login form */}
                <div>
                    <form onSubmit={handleSubmit}>
                    <div className="relative mb-4">
                        <input
                        type="text"
                        placeholder="username"
                        name="username"
                        className="w-full p-2 pl-10 pr-2 mb-4 border rounded-md"
                        value={formData.username}
                        onChange={handleChange}
                        />
                        <BsFillPersonFill className='absolute left-3 top-2.5 text-gray-500 pointer-events-none'/>
                        {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                        )}
                    </div>



                    <div className="relative mb-4">
                        <input
                        type="password"
                        name="password"
                        placeholder="password"
                        className="w-full p-2 pl-10 pr-2 mb-4 border rounded-md"
                        value={formData.password}
                        onChange={handleChange}
                        />
                        <BsFillEyeSlashFill className='absolute left-3 top-2.5 text-gray-500 pointer-events-none'/>
                        {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                         )}
                    </div>


                    <button
            type="submit"
            disabled={isLoading}
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
        
            {isLoading ? 'Logging in...' : 'Sign In'} 
          </button>


          <div className="mt-4 text-center">
                    <a href="/signup" className="text-blue-500 hover:underline">
                        Don't have an account? Sign up
                    </a>
                </div>



                    </form>
                </div>

            </div>

        </div>

    )
}

export default Login