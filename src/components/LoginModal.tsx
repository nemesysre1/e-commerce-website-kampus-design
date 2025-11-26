// src/components/LoginModal.tsx
import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
      });

      const data = await res.json();
      console.log('LOGIN RESPONSE:', data);

      if (!res.ok) {
        alert(data.message || 'Login gagal');
        setLoading(false);
        return;
      }

      const userData = {
        id: data.id,
        name: data.name,
        email: loginData.email,
        userType: data.role, // buyer / seller
      };

      login(userData);

      if (data.role === 'seller') {
        window.location.href = '/admin';
      } else {
        onClose();
      }
    } catch (err) {
      console.error('LOGIN FETCH ERROR:', err);
      alert('Tidak bisa terhubung ke backend. Pastikan backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      alert('Password tidak cocok');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          role: registerData.userType, // harus 'role'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Register gagal');
        return;
      }

      alert('Registrasi berhasil, silakan login.');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat registrasi');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Masuk ke Akun Anda
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="login"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Masuk</TabsTrigger>
            <TabsTrigger value="register">Daftar</TabsTrigger>
          </TabsList>

          <TabsContent
            value="login"
            className="space-y-4"
          >
            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>

            <Separator />

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
              >
                Masuk dengan Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
              >
                Masuk dengan Facebook
              </Button>
            </div>
          </TabsContent>

          <TabsContent
            value="register"
            className="space-y-4"
          >
            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div>
                <Label>Nama Lengkap</Label>
                <Input
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Konfirmasi Password</Label>
                <Input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Daftar sebagai</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userType"
                      value="buyer"
                      checked={registerData.userType === 'buyer'}
                      onChange={(e) => setRegisterData({ ...registerData, userType: e.target.value })}
                    />{' '}
                    <span className="ml-2">Pembeli</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userType"
                      value="seller"
                      checked={registerData.userType === 'seller'}
                      onChange={(e) => setRegisterData({ ...registerData, userType: e.target.value })}
                    />{' '}
                    <span className="ml-2">Penjual</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
              >
                Daftar Sekarang
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
