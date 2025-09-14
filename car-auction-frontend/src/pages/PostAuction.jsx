import { useRef, useState, useEffect } from 'react';
import carLogoWhite from '../assets/Pi7_high-speed.png';
import carLogoBlack from '../assets/high-speed.png';
import { GiTrafficLightsRed } from 'react-icons/gi';
import { formatToIST, toISODateTime } from '../utils/dateUtils';
import axios from '../api/axios';

const PostAuction = () => {
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState('');

  const [file, setFile] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');

  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (errMsg && errRef.current) {
      errRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      errRef.current.focus(); // optional, for screen readers
    }
  }, [errMsg]);

  const handleAuctionForm = async (e) => {
    e.preventDefault();
    if (
      !file ||
      !title ||
      !category ||
      !year ||
      !startingPrice ||
      !description ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime
    ) {
      setErrMsg('All fields are required');
      return;
    }

    // console.log(file);

    const startISO = toISODateTime(startDate, startTime);
    const endISO = toISODateTime(endDate, endTime);
    const now = new Date();
    if (now >= new Date(startISO)) {
      setErrMsg('Starting time should be in future');
      return;
    } else if (new Date(endISO) <= new Date(startISO)) {
      setErrMsg('Start time should be less that End time');
      return;
    }

    const formData = new FormData();

    formData.append('title', title);
    formData.append('category', category);
    formData.append('year', year);
    formData.append('startingPrice', startingPrice);
    formData.append('startTime', startISO);
    formData.append('endTime', endISO);
    formData.append('description', description);

    file.forEach((f) => formData.append('carImages', f));

    try {
      const response = await axios.post('/auction/post-auction', formData);
      console.log('Auction created:', response.data);
    } catch (error) {
      console.log(error);

      setErrMsg(error.response?.data?.message || 'Something went wrong');
    }
  };
  return (
    <section>
      <div className="max-w-md mx-auto p-6 shadow-lg rounded-xl flex flex-col gap-4">
        <p className="text-3xl text-center text-stone-700 flex items-center justify-center gap-1 self-center">
          <span className="text-nowrap">Create Auction</span>{' '}
          <span className="w-full">
            <img
              src={carLogoWhite}
              alt="Car Auction Logo"
              className="h-15 hidden dark:block"
            />
            <img
              src={carLogoBlack}
              alt="Car Auction Logo"
              className="h-15 dark:hidden block"
            />
          </span>
        </p>

        {errMsg && (
          <div className="flex justify-center">
            <p
              ref={errRef}
              tabIndex="-1"
              className=" text-center text-red-600 text-sm rounded-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <GiTrafficLightsRed className="w-5 h-6" />
                {errMsg}
              </span>
            </p>
          </div>
        )}

        <form onSubmit={handleAuctionForm} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Car Name"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-300 dark:bg-gray-900 shadow-2xl dark:shadow-stone-900 dark:shadow-xl shadow-stone-500 d rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 bg-gray-300 dark:bg-gray-900 shadow-2xl dark:shadow-stone-900 dark:shadow-xl shadow-stone-500 d rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
          />

          <input
            type="number"
            name="year"
            placeholder="Model Year"
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 bg-gray-300 dark:bg-gray-900 shadow-2xl dark:shadow-stone-900 dark:shadow-xl shadow-stone-500 d rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
            min="1900"
            max="2099"
            step="1"
          />
          <label className="flex flex-col gap-1">
            <p className="text-lg"> Starting Price:</p>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="1"
              placeholder="Enter price"
              onChange={(e) => setStartingPrice(e.target.value)}
              className="w-full p-3 bg-gray-300 dark:bg-gray-900 shadow-2xl dark:shadow-stone-900 dark:shadow-xl shadow-stone-500 d rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
            ></input>
          </label>
          <label className="flex flex-col gap-1">
            <p className="text-lg"> Start Time:</p>
            <div className="flex flex-row gap-2">
              <input
                type="date"
                name="startDate"
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 bg-gray-300 dark:bg-gray-900 shadow-2xl dark:shadow-stone-900 dark:shadow-xl shadow-stone-500 d rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
              />
              <input
                type="time"
                name="startTime"
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 bg-gray-300 dark:bg-gray-900 shadow-2xl dark:shadow-stone-900 dark:shadow-xl shadow-stone-500 d rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <p className="text-lg"> End Time:</p>
            <div className="flex flex-row gap-2">
              <input
                type="date"
                name="endDate"
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 bg-gray-300 dark:bg-gray-900 shadow-2xl dark:shadow-stone-900 dark:shadow-xl shadow-stone-500 d rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
              />
              <input
                type="time"
                name="endTime"
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 bg-gray-300 dark:bg-gray-900 shadow-2xl dark:shadow-stone-900 dark:shadow-xl shadow-stone-500 d rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
              />
            </div>
          </label>

          <input
            type="file"
            multiple
            onChange={(e) => setFile([...e.target.files])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded-full shadow-stone-500 d-0
               file:text-sm file:font-semibold
               file:bg-green-50 file:text-stone-700
               hover:file:bg-green-100 cursor-pointer"
          />
          <input
            type="text"
            name="description"
            placeholder="Description about car"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-300 dark:bg-gray-900 shadow-2xl dark:shadow-stone-900 dark:shadow-xl shadow-stone-500 d rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
          />

          <button
            type="submit"
            className="w-full py-3 bg-stone-700 text-white font-semibold rounded-lg hover:bg-stone-800 transition"
          >
            Create Auction
          </button>
        </form>
      </div>
    </section>
  );
};

export default PostAuction;
