import React, { useState } from 'react';
import axios from '../api/axios';

const Avatar = () => {
  const [profilePic, setProfilepic] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    // setFile(selectedFile);

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const response = await axios.post('/user/avatar', formData);
      setProfilepic(response.data.avatar);
      console.log('Avatar uploaded', response.data);
    } catch (error) {
      console.error('On avatar uploading', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col justify-center items-center">
        <div className="flex items-center gap-3">
          {/* Hidden native input */}
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />

          {/* Custom button to trigger input */}
          <label
            htmlFor="file"
            className="px-4 py-2 bg-white/20 text-white rounded-lg cursor-pointer hover:bg-white/50 backdrop-blur-2xl w-40"
          >
            {profilePic ? (
              <img src={profilePic} alt="avatar" className="w-full" />
            ) : (
              <img
                src="src/assets/305982.png"
                alt="avatar"
                className="w-full"
              />
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
