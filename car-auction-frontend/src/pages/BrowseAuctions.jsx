import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import SlidePhoto from '../components/SlidePhoto';
import { useNavigate } from 'react-router-dom';
import carLogoWhite from '../assets/Pi7_high-speed.png';
import carLogoBlack from '../assets/high-speed.png';

const BrowseAuctions = () => {
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await axios.get('/auction/auctions');

      setAuctions(response.data.fullDetailsAuction);
      // response.data.fullDetailsAuction.forEach((auctions) => {
      //   console.log(auctions.sellerInfo);
      //   console.log(auctions.auctionInfo);
      // });
    } catch (error) {
      console.error(error);
    }
  };

  const collectAuctionID = (e) => {
    const auctionId = e.currentTarget.dataset.auction;
    navigate('/auction-info', { state: { auctionID: auctionId } });
  };

  return (
    <section className="flex flex-col gap-7 p-4 w-full">
      <p className="text-3xl text-center text-stone-700 flex items-center justify-center gap-1 self-center">
        <span className="text-nowrap">Browse Auctions</span>{' '}
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
      {!auctions || auctions?.length === 0 ? (
        <div className="text-xl text-center">
          No auctions available right now.
        </div>
      ) : (
        auctions?.map((auction) => (
          <div
            key={auction.auctionInfo._id}
            data-auction={auction.auctionInfo._id}
            className="p-4 rounded mb-2 shadow-xl shadow-gray-950 dark:shadow-gray-800 flex flex-col gap-5 w-full"
          >
            <div className="w-full rounded-lg overflow-hidden">
              <SlidePhoto images={auction.auctionInfo.carImages} />
            </div>
            <div className="flex flex-col gap-5 justify-center w-full">
              <div className="flex justify-around items-center">
                <p>Starting Price: </p>{' '}
                <div className="border-1 py-1 px-7 rounded-lg border-green-600 text-green-600 self-center w-fit">
                  {auction.auctionInfo.startingPrice}
                </div>
              </div>

              <div className="flex justify-between items-center gap-3">
                <div className="flex justify-start items-center gap-3">
                  {' '}
                  <img
                    src={auction.sellerInfo.avatar}
                    alt=""
                    className="w-9 h-9 rounded-full"
                  />{' '}
                  <h2 className="font-bold">{auction.sellerInfo.fullname}</h2>
                </div>
                <p className="text-sm text-blue-600 ">Auctioneer</p>
              </div>
              <p
                data-auction={auction.auctionInfo._id}
                onClick={collectAuctionID}
                className="bg-blue-500 py-1 px-7 rounded-lg self-center text-white text-sm cursor-pointer"
              >
                View Auction Details
              </p>
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default BrowseAuctions;
