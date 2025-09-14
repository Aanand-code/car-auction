import React from 'react';
import { useState, useRef } from 'react';
import axios from '../api/axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';
import { GiTrafficLightsRed } from 'react-icons/gi';
import carLogoWhite from '../assets/Pi7_high-speed.png';
import carLogoBlack from '../assets/high-speed.png';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { setAuth } = useAuthStore();

  const errRef = useRef();

  const [otp, setOTP] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        '/user/verifyUser',
        { email, otp },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(response.data);
      setAuth({ email: response.data.user }, response.data.accessToken);

      navigate('/', { replace: true });
    } catch (error) {
      setErrMsg(`${error.response.data.message}`);
    }
  };

  return (
    <section className="flex grow justify-center  h-full w-full py-10">
      <p className="text-3xl text-center text-stone-700 flex items-center justify-center gap-1 self-center">
        <span className="text-nowrap">Email Verification</span>{' '}
        <span className="w-full">
          <img
            src={carLogoWhite}
            alt="Car Auction Logo"
            className="h-17 hidden dark:block"
          />
          <img
            src={carLogoBlack}
            alt="Car Auction Logo"
            className="h-17 dark:hidden block"
          />
        </span>
      </p>
      <div className="flex flex-col gap-10 justify-center items-center">
        <h3 className="text-xl">Check your email: {email}</h3>
        <div className="relative flex justify-center">
          <p
            ref={errRef}
            className={
              errMsg
                ? 'block border-1 absolute text-nowrap text-red-500 text-lg p-1.5 rounded-xl '
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
          className="p-3 flex flex-col items-center gap-7"
        >
          <label htmlFor="otp">One Time Password </label>
          <input
            type="text"
            id="otp"
            onChange={(e) => setOTP(e.target.value)}
            className="bg-neutral-300/40 backdrop-blur-xl  p-1.5 rounded-lg"
          />
          <div className="w-full">
            <button
              disabled={!otp ? true : false}
              className={
                !otp
                  ? 'bg-stone-900 w-full text-lg p-1 rounded-xl text-white/55 cursor-not-allowed'
                  : 'bg-stone-700 w-full text-lg p-1 rounded-xl text-white cursor-pointer'
              }
            >
              Verify
            </button>
          </div>
        </form>
        <p className="text-lg">
          Resend OTP?
          <Link to="/login" className="text-stone-500">
            {'  '}
            Click here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default VerifyOTP;
