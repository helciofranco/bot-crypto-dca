import axios from 'axios';

type IpResponse = {
  ip: string;
};

export const getMyIp = async () => {
  const { data } = await axios.get<IpResponse>(
    'https://api.ipify.org?format=json',
  );
  return data.ip;
};
