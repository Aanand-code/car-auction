import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import SlidePhoto from '../components/SlidePhoto';
import socket from '../api/socket';

const AuctionInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [auction, setAuction] = useState({});
  const [auctioneer, setAuctioneer] = useState({});

  const auctionID = location.state?.auctionID;

  useEffect(() => {
    socket.emit('join-auction', auctionID);
    console.log('Component mounted');

    return () => {
      socket.emit('leave-auction', auctionID);
      console.log('Component unmounted (cleanup)');
    };
  }, [auctionID]);

  useEffect(() => {
    if (!auctionID) {
      navigate('/', { replace: true });
      return;
    }

    fetchAuctionDetails();
  }, [auctionID, navigate]);

  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get('/auction/auction-details', {
        params: {
          auctionID,
        },
      });

      console.log(response.data.auctionInfo);
      // console.log(response.data.auctioneerInfo);
      setAuction(response.data.auctionInfo);
      setAuctioneer(response.data.auctioneerInfo);
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(auction);

  return (
    <section className="w-full flex flex-col">
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

          <div className="flex justify-between bg-blue-500 px-5 p-1 rounded-lg">
            <h2>Current Price</h2>
            <h2>{auction.currentPrice}</h2>
          </div>

          <div className="flex flex-col justify-center items-center gap-4 w-full">
            <p className="text-lg font-bold bg-stone-800 rounded-lg py-1 px-15 text-center">
              Raise Bid
            </p>
            <div className="flex flex-row justify-around items-center gap-3 w-full">
              <div className=" py-1 w-full text-center bg-green-400 rounded-lg">
                25,000
              </div>
              <div className=" py-1 w-full text-center bg-green-500 rounded-lg">
                50,000
              </div>
              <div className=" py-1 w-full text-center bg-green-600 rounded-lg">
                75,000
              </div>
            </div>
            <div className=" py-1 w-full text-center bg-green-700 rounded-lg">
              1,00,000
            </div>
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

      <div className="w-full px-5">
        <div>Bids</div>
      </div>
    </section>
  );
};

export default AuctionInfo;
