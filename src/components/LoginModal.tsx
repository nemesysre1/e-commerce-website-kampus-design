import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Eye, EyeOff, X } from "lucide-react";
import { apiLogin, apiRegister } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: Props) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "buyer",
  });

  // ======================================
  // HANDLE LOGIN
  // ======================================
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await apiLogin(loginData.email, loginData.password);

    // login user ke context
    login({
      id: res.id,
      name: res.name,
      email: loginData.email,
      userType: res.role.trim().toLowerCase(), // pastikan 'seller' atau 'buyer'
    });

    // redirect berdasarkan role
    if (res.role.trim().toLowerCase() === "seller") {
      navigate("/admin");
    } else {
      navigate("/");
    }

    onClose();
  } catch {
    alert("Login gagal. Periksa email atau password.");
  }

  setLoading(false);
};

  // ======================================
  // HANDLE REGISTER
  // ======================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      alert("Password tidak sama!");
      return;
    }

    try {
      setLoading(true);

      await apiRegister(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.userType
      );

      alert("Registrasi berhasil! Silakan login.");
    } catch {
      alert("Gagal melakukan registrasi");
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Masuk / Daftar
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Masuk</TabsTrigger>
            <TabsTrigger value="register">Daftar</TabsTrigger>
          </TabsList>

          {/* ================= LOGIN ================= */}
          <TabsContent value="login">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <Separator className="my-4" />
          </TabsContent>

          {/* ================= REGISTER ================= */}
          <TabsContent value="register">
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <Label>Nama Lengkap</Label>
                <Input
                  required
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Konfirmasi Password</Label>
                <Input
                  type="password"
                  required
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
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
                      checked={registerData.userType === "buyer"}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          userType: e.target.value,
                        })
                      }
                    />
                    <span className="ml-2">Pembeli</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userType"
                      value="seller"
                      checked={registerData.userType === "seller"}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          userType: e.target.value,
                        })
                      }
                    />
                    <span className="ml-2">Penjual</span>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Daftar Sekarang
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
