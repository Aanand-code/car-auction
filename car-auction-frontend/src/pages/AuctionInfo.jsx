import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import SlidePhoto from '../components/SlidePhoto';
import socket from '../api/socket';
import carLogoWhite from '../assets/Pi7_high-speed.png';
import carLogoBlack from '../assets/high-speed.png';

const AuctionInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [auction, setAuction] = useState({});
  const [auctioneer, setAuctioneer] = useState({});
  const [bids, setBids] = useState([]);
  const [timer, setTimer] = useState('');
  const [endTimer, setEndTimer] = useState('');
  // const [currentPrice, setCurrentPrice] = useState()

  const auctionID = location.state?.auctionID;

  useEffect(() => {
    socket.emit('join-auction', auctionID);

    return () => {
      socket.emit('leave-auction', auctionID);
    };
  }, [auctionID]);

  useEffect(() => {
    socket.on('new-bid', (data) => {
      console.log('New bid received:', data);

      setAuction((prev) => ({
        ...prev,
        currentPrice: data.bidsInfo.totalAmount,
      }));
      setBids((prev) => [data.bidsInfo, ...prev]);
    });
    return () => socket.off('new-bid');
  }, []);

  useEffect(() => {
    if (!auctionID) {
      navigate('/', { replace: true });
      return;
    }

    fetchAuctionDetails();
    getAllBids();
  }, [auctionID, navigate]);

  function formatTime(ms) {
    if (ms <= 0) return '0d 0h 0m 0s';

    let totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    totalSeconds %= 3600 * 24;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  useEffect(() => {
    if (!auction.startTime || !auction.endTime) return;

    const start = new Date(auction.startTime).getTime();
    const end = new Date(auction.endTime).getTime();

    const interval = setInterval(() => {
      const now = Date.now();

      if (now < start) {
        // before auction starts
        setTimer(formatTime(start - now));
        setEndTimer('');
      } else if (now >= start && now < end) {
        // auction is live
        setTimer('Auction is LIVE');
        setEndTimer(formatTime(end - now));
      } else {
        // auction ended
        setTimer('Auction Ended');
        setEndTimer('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auction.startTime, auction.endTime]);

  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get('/auction/auction-details', {
        params: {
          auctionID,
        },
      });
      const now = new Date();
      // console.log(response.data.auctionInfo);
      // console.log(response.data.auctioneerInfo);
      setAuction(response.data.auctionInfo);
      setAuctioneer(response.data.auctioneerInfo);
      setTimer(formatTime(response.data.auctionInfo.startTime - now));
    } catch (error) {
      console.error(error);
    }
  };

  const getAllBids = async () => {
    try {
      const response = await axios.get('/bid/get-bids', {
        params: {
          auctionID,
        },
      });

      console.log(response.data.bidsInfo);

      setBids(response.data.bidsInfo);
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(auction);

  const handleRaiseBid = async (e) => {
    const amount = Number(e.currentTarget.dataset.amount);

    const response = await axios.post(
      '/bid/new-bid',
      { auctionId: auctionID, bidAmount: amount },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // console.log(response);
  };

  return (
    <section className="w-full flex flex-col">
      <p className="text-3xl text-center text-stone-700 flex items-center justify-center gap-2 self-center">
        <span className="text-nowrap">Auction Details</span>{' '}
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
      <div
        className="flex flex-col w-full justify-center gap-5 pb-7"
        data-auctionid={auction._id}
      >
        <div>
          {auction.carImages && <SlidePhoto images={auction.carImages} />}
        </div>

        <div className="w-full px-5 flex flex-col gap-5">
          <div className="flex justify-between items-center gap-3">
            <div className="flex justify-start items-center gap-3">
              {' '}
              <img
                src={auctioneer.avatar}
                alt="Car Photos"
                className="w-9 h-9 rounded-full"
              />{' '}
              <h2 className="font-bold text-nowrap">{auctioneer.fullname}</h2>
            </div>
            <p className="text-sm text-blue-600 ">Auctioneer</p>
          </div>

          <div className="flex justify-between  px-5 p-1 rounded-lg">
            <h2>Status</h2>
            <h2 className="text-green-500">{auction.status}</h2>
          </div>

          <div className="flex justify-between px-5 p-1 rounded-lg">
            <h2>Starts In:</h2>
            <h2 className="text-green-500">{timer}</h2>
          </div>

          {endTimer && (
            <div className="flex justify-between px-5 p-1 rounded-lg">
              <h2>Ends In:</h2>
              <h2 className="text-red-500">{endTimer}</h2>
            </div>
          )}

          <div className="flex justify-between bg-blue-500 px-5 p-1 rounded-lg">
            <h2>Current Price</h2>
            <h2>{auction.currentPrice}</h2>
          </div>

          <div className="flex flex-col justify-center items-center gap-4 w-full">
            <p className="text-lg font-bold bg-stone-800 rounded-lg py-1 px-15 text-center">
              Raise Bid
            </p>
            <div className="flex flex-row justify-around items-center gap-3 w-full">
              <button
                data-amount="25000"
                onClick={handleRaiseBid}
                className=" py-1 w-full text-center bg-green-400 rounded-lg"
              >
                25,000
              </button>
              <button
                data-amount="50000"
                onClick={handleRaiseBid}
                className=" py-1 w-full text-center bg-green-500 rounded-lg"
              >
                50,000
              </button>
              <button
                data-amount="75000"
                onClick={handleRaiseBid}
                className=" py-1 w-full text-center bg-green-600 rounded-lg"
              >
                75,000
              </button>
            </div>
            <button
              data-amount="100000"
              onClick={handleRaiseBid}
              className=" py-1 w-full text-center bg-green-700 rounded-lg"
            >
              1,00,000
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <p className="flex flex-row gap-3 items-center">
              Description:
              <span className="text-gray-500 text-sm italic">
                "{auction.description}"
              </span>
            </p>
            <p className="flex flex-row text-yellow-500 gap-3">
              Model name:<span className="text-gray-400 ">{auction.title}</span>
            </p>
            <p className="flex flex-row text-yellow-500 gap-3">
              Model Year:<span className="text-gray-400">{auction.year}</span>
            </p>
            <p className="flex flex-row text-yellow-500 gap-3">
              Category:<span className="text-gray-400">{auction.category}</span>
            </p>
          </div>
        </div>
      </div>

      <p className="p-2 bg-blue-500 rounded-lg text-center text-lg font-bold">
        Bids
      </p>
      <div className="">
        {bids?.length === 0 ? (
          <div className="text-lg font-bold border-t h-100 flex flex-col justify-center items-center border-t-red-950 w-full px-5">
            There is no bid available right now.
          </div>
        ) : (
          bids.map((bid) => (
            <div key={bid.bidId} className="flex flex-col p-3">
              <div className="flex flex-row items-center gap-2 p-4 border-2">
                <img
                  src={bid.bidderInfo.avatar}
                  alt="avatar"
                  className="w-7 h-7 rounded-full"
                />
                <div>
                  {bid.bidderInfo.fullname} placed a bid of {bid.amount}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default AuctionInfo;
