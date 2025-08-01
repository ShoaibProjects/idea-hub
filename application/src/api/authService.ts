import apiClient from '../api/apiClient';
import { User, SigninCredentials, SignupData} from '../types/authTypes'

const signin = async ({ username, password, rememberMe }: SigninCredentials): Promise<User> => {
  const response = await apiClient.post<User>('/user/signin', {
    username,
    password,
    rememberMe,
  });
  return response.data;
};

const signup = async (userData: SignupData): Promise<User> => {
  const response = await apiClient.post<User>('/user/signup', userData);
  return response.data;
}

const fetchUserData = async (): Promise<User> => {
  const response = await apiClient.get<User>('/user/getUser/current');
  return response.data;
};

interface IAuthService {
  signin: (credentials: SigninCredentials) => Promise<User>;
  signup: (userData: SignupData) => Promise<User>;
  fetchUserData: ()=> Promise<User>;
}

const authService: IAuthService = {
  signin,
  signup,
  fetchUserData
};

export default authService;