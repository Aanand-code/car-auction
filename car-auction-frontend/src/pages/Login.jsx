import React from 'react';
import { useRef, useEffect, useState } from 'react';
import useAuthStore from '../hooks/useAuthStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { GiTrafficLightsRed } from 'react-icons/gi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { setAuth } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [validEmail, setvalidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    // console.log(result);
    // console.log(email);

    setvalidEmail(result);
  }, [email]);

  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        '/user/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      // console.log(response.data.user);

      setAuth(response.data.user, response.data.accessToken);

      navigate('/', { replace: true });
    } catch (error) {
      console.error(error.response.data.message);

      setErrMsg(`${error.response.data.message}`);
    }
  };

  return (
    <section className="flex grow justify-center  self-center h-full w-full py-10">
      <div className="w-full flex flex-col gap-15 items-center">
        <div className="flex flex-col  justify-center items-center gap-4">
          <p className="text-3xl text-center text-indigo-600 flex items-center justify-center gap-2">
            <span>#Go</span>{' '}
            <span className="w-full">
              <img
                src="src/assets/Pi7_high-speed.png"
                alt="Car Auction Logo"
                className="h-17 hidden dark:block"
              />
              <img
                src="src/assets/high-speed.png"
                alt="Car Auction Logo"
                className="h-17 dark:hidden block"
              />
            </span>
          </p>
          <p className="text-3xl text-center text-amber-300 dark:text-amber-300">
            {'{'}{' '}
            <span className="text-stone-500 dark:text-stone-400/70 text-2xl">
              Drive your dreams.{' '}
            </span>{' '}
            {'}'}
          </p>
        </div>
        <div className="relative flex justify-center">
          <p
            ref={errRef}
            className={
              errMsg
                ? 'block border-1 absolute text-nowrap text-red-500 text-lg p-1.5 rounded-lg '
                : 'hidden'
            }
          >
            <span className="flex items-center gap-1.5">
              <GiTrafficLightsRed className="w-7 h-7" />
              {errMsg}
            </span>
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-10 min-w-4/5"
        >
          <div className="flex flex-col gap-3">
            <label htmlFor="email" className="flex flex-row items-center">
              <span>Email:</span>
              <span className={validEmail ? 'hidden' : 'block text-red-500'}>
                *
              </span>
              <span className={validEmail ? 'block text-green-500' : 'hidden'}>
                *
              </span>
            </label>
            <input
              type="text"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-neutral-300/40 backdrop-blur-xl  p-1.5 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="password" className="flex flex-row items-center">
              {' '}
              <span>Password:</span>
              <span className={password ? 'hidden' : 'block text-red-500'}>
                *
              </span>
              <span className={password ? 'block text-green-500' : 'hidden'}>
                *
              </span>
            </label>
            <input
              type="password"
              className="bg-neutral-300/40 backdrop-blur-xl  p-1.5 rounded-lg"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full">
            <button
              disabled={!validEmail || !password ? true : false}
              className={
                !validEmail || !password
                  ? 'bg-stone-900 w-full text-lg p-1 rounded-xl text-white/55 cursor-not-allowed'
                  : 'bg-stone-700 w-full text-lg p-1 rounded-xl text-white cursor-pointer'
              }
            >
              Log in
            </button>
          </div>
        </form>
        <p className="text-lg">
          Need an account?
          <Link to="/register" className="text-stone-500">
            {'  '}
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  );
};
export default Login;
