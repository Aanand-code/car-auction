import React, { useState } from 'react';
import Avatar from '../components/Avatar';
import useAuthStore from '../hooks/useAuthStore';
import axios from '../api/axios';
import carLogoWhite from '../assets/Pi7_high-speed.png';
import carLogoBlack from '../assets/high-speed.png';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleName = async (e) => {
    const newName = e.target.value;
    setName(newName);

    try {
      const response = await axios.post(
        '/user/update-name',
        { name: newName }, // use the fresh value
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      updateUser({
        name: response.data.name,
      });
    } catch (error) {
      console.error('Error while uploading name:  ', error);
    }
  };
  const handleBio = async (e) => {
    const newBio = e.target.value;
    setBio(newBio);

    try {
      const response = await axios.post(
        '/user/update-bio',
        { bio: newBio }, // use the fresh value
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log(response.data.bio);

      updateUser({
        bio: response.data.bio,
      });
    } catch (error) {
      console.error('Error while uploading bio:  ', error);
    }
  };
  return (
    <section className="flex flex-col gap-7 p-4 w-full self-center">
      <p className="text-3xl text-center text-stone-700 flex items-center justify-center gap-1 self-center">
        <span className="text-nowrap">Profile</span>{' '}
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
      <div className="flex flex-col gap-10">
        <div>
          {' '}
          <Avatar />
        </div>
        <div className="flex flex-row justify-center items-center gap-10">
          <label htmlFor="bio">Bio :</label>
          <input
            type="text"
            id="bio"
            value={bio}
            placeholder={!user?.bio ? 'Update your bio' : ''}
            onChange={handleBio}
          />
        </div>
        <div className="flex flex-row justify-start items-center gap-10">
          <label htmlFor="name">Name :</label>
          <input
            type="text"
            id="name"
            value={name}
            placeholder={!user?.name ? 'Please write your name' : ''}
            onChange={handleName}
          />
        </div>

        <div className="flex flex-row justify-start items-center gap-10">
          <p>Email :</p>
          <p className="dark:text-gray-700 text-gray-500">{user?.email}</p>
        </div>
      </div>
    </section>
  );
};

export default Profile;
