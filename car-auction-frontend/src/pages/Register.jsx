import { useRef, useEffect, useState } from 'react';
import axios from '../api/axios.js';
import carLogoBlack from '../assets/high-speed.png';
import carLogoWhite from '../assets/Pi7_high-speed.png';
import { Link, useNavigate } from 'react-router-dom';
import { GiTrafficLightsRed } from 'react-icons/gi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [validEmail, setvalidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

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
    const result = PASSWORD_REGEX.test(password);
    // console.log(result);

    setValidPassword(result);
    const match = password === matchPassword;
    // console.log(password);
    // console.log(matchPassword);

    // console.log(match);

    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg('');
  }, [email, password, matchPassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PASSWORD_REGEX.test(password);
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry');
      return;
    }
    // console.log('hello');

    try {
      const response = await axios.post(
        '/user/signup',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log(response.data);
      navigate('/verify-otp', { state: { email } });

      //
    } catch (error) {
      setErrMsg(`${error.response.data.message}`);
    }
  };

  return (
    <section className="flex grow justify-center  self-center h-full w-full py-5">
      <div className="w-full flex flex-col gap-15 items-center">
        <div className="flex flex-col  justify-center items-center gap-4">
          <p className="text-3xl text-center text-indigo-600 flex items-center justify-center gap-2">
            <span>#begin</span>{' '}
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
          <p className="text-3xl text-center text-amber-300 dark:text-amber-300">
            {'{'}{' '}
            <span className="text-stone-500 dark:text-stone-400/70 text-2xl">
              Bid today. Win tomorrow.
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-7 min-w-4/5">
          <div className="flex flex-col gap-3 w-full">
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
              onChange={(e) => {
                // console.log(e.target.value);
                setEmail(e.target.value);
              }}
              required
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              className="bg-neutral-300/40 backdrop-blur-xl  p-1.5 rounded-lg"
            />
            <div className="relative flex justify-start">
              <p
                className={
                  emailFocus && email && !validEmail
                    ? 'block border-1 absolute text-nowrap bg-gray-800 text-gray-100 p-1 text-sm  rounded-lg z-1 '
                    : 'hidden'
                }
              >
                4 to 24 character. <br />
                Must begin with a letter. <br />
                Letter, numbers, underscores, hyphens allowed.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="password" className="flex flex-row items-center">
              {' '}
              <span>Password:</span>
              <span className={validPassword ? 'hidden' : 'block text-red-500'}>
                *
              </span>
              <span
                className={
                  validPassword && password ? 'block text-green-500' : 'hidden'
                }
              >
                *
              </span>
            </label>
            <input
              type="password"
              id="password"
              onInput={(e) => {
                // console.log(e.target.value);

                setPassword(e.target.value);
              }}
              required
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              className="bg-neutral-300/40 backdrop-blur-xl  p-1.5 rounded-lg"
            />
            <div className="relative flex justify-start">
              <p
                className={
                  passwordFocus && !validPassword
                    ? 'block border-1 absolute text-nowrap bg-gray-800 text-gray-100 p-1 text-sm  rounded-lg z-1 '
                    : 'hidden'
                }
              >
                At least 6 characters. <br />
                Must have at least one letter.
                <br />
                Must have at least one number.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label
              htmlFor="confirm-password"
              className="flex flex-row items-center"
            >
              {' '}
              <span>Confirm-Password:</span>
              <span
                className={
                  validMatch && matchPassword ? 'hidden' : 'block text-red-500'
                }
              >
                *
              </span>
              <span
                className={
                  validMatch && matchPassword
                    ? 'block text-green-500'
                    : 'hidden'
                }
              >
                *
              </span>
            </label>
            <input
              type="password"
              id="confirm-password"
              onChange={(e) => {
                // console.log(e.target.value);

                setMatchPassword(e.target.value);
              }}
              required
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              className="bg-neutral-300/40 backdrop-blur-xl  p-1.5 rounded-lg"
            />
            <div className="relative flex justify-start">
              <p
                className={
                  matchFocus && !validMatch
                    ? 'block border-1 absolute text-nowrap bg-gray-800 text-gray-100 p-1 text-sm  rounded-lg z-1 '
                    : 'hidden'
                }
              >
                Confirm password must exactly <br /> match the password
              </p>
            </div>
          </div>
          <div className="w-full">
            <button
              disabled={
                !validEmail || !validPassword || !validMatch ? true : false
              }
              className={
                !validEmail || !validPassword || !validMatch
                  ? 'bg-stone-900 w-full text-lg p-1 rounded-xl text-white/55 cursor-not-allowed'
                  : 'bg-stone-700 w-full text-lg p-1 rounded-xl text-white cursor-pointer'
              }
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-lg">
          Already registered?
          <Link to="/login" className="text-stone-500">
            {'  '}
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
