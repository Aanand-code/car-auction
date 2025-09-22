import axios from '../api/axios';
import useAuthStore from '../hooks/useAuthStore';
import defaultAvatar from '../assets/305982.png';
import { useState } from 'react';

const Avatar = () => {
  const { user, updateUser } = useAuthStore();
  const [profilePic, setProfilepic] = useState(user.avatar || null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    // setFile(selectedFile);

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const response = await axios.post('/user/avatar', formData);
      setProfilepic(response.data.avatar);
      updateUser({
        avatar: response.data.avatar,
      });
      // console.log('Avatar uploaded', response.data);
    } catch (error) {
      console.error('On avatar uploading', error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <input
        type="file"
        id="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />

      <label
        htmlFor="file"
        className="px-4 py-2 bg-white/20 text-white rounded-lg cursor-pointer hover:bg-white/50 backdrop-blur-2xl w-50"
      >
        {profilePic ? (
          <img src={profilePic} alt="avatar" className="w-full rounded-full" />
        ) : (
          <img
            src={defaultAvatar}
            alt="avatar"
            className="w-full rounded-full"
          />
        )}
      </label>
    </div>
  );
};

export default Avatar;
