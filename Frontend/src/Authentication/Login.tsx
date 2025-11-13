import { useEffect, useState } from 'react';
import { Eye, EyeOff, Mail, User, Lock, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [user, setUser] = useState(null);
  const[message, setMessage] = useState("");
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      enqueueSnackbar(res?.data?.message, {variant: "success"});
      setFormData({
        fullName: '',
        email: '',
        password: ''
    })

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));


    navigate('/HomePage');

      
    } catch(err: any) {
      setFormData({
        fullName: '',
        email: '',
        password: ''
    })
      
      enqueueSnackbar(err.response.data.message, {variant: "error"});
    }

    
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Signup Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md backdrop-blur-sm bg-opacity-95">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-500">Join us and start your journey today</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Full Name Input */}
          

          {/* Email Input */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className={`w-5 h-5 transition-colors ${focused === 'email' ? 'text-purple-500' : 'text-gray-400'}`} />
              </div>                
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 transition-colors ${focused === 'password' ? 'text-purple-500' : 'text-gray-400'}`} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters</p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            Login
          </button>
        </div>
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
              Sign up
            </button>
          </p>
        </div>

        {/* Divider */}
        <div className="mt-8 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500">or continue with</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Social Buttons */}
        <p>{message}</p>
        
      </div>
    </div>
  );
}