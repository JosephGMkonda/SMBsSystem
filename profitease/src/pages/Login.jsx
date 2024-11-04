

import { BsFillPersonFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";


const Login = () => {

    return (
    
        <div className="flex justify-center items-center h-screen">
            <div className="w-96 p-6 shadow-lg bg-white rounded-md">

                <div className="flex justify-center mb-6">
                    <h1 className="text-blue-500 text-3xl font-semibold">Profit Ease</h1>

                </div>

                {/* form login form */}
                <div>
                    <form>
                    <div className="relative mb-4">
                        <input
                        type="text"
                        placeholder="username"
                        className="w-full p-2 pl-10 pr-2 mb-4 border rounded-md"
                        />
                        <BsFillPersonFill className='absolute left-3 top-2.5 text-gray-500 pointer-events-none'/>
                        
                    </div>



                    <div className="relative mb-4">
                        <input
                        type="password"
                        placeholder="password"
                        className="w-full p-2 pl-10 pr-2 mb-4 border rounded-md"
                        />
                        <BsFillEyeSlashFill className='absolute left-3 top-2.5 text-gray-500 pointer-events-none'/>
                        
                    </div>


                    <button
            type="submit"
            // disabled={isLoading}
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            SignIn
            {/* {isLoading ? 'Logging in...' : 'Login'} */}
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