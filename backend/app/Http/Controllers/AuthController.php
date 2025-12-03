<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; 
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $r) {

        $messages = [
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal :min karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
        ];

        $data = $r->validate([
           'name'=>'required|string',
           'email'=>'required|email|unique:users',
           'password'=>'required|min:6'
        ], $messages);

        $user = User::create([
           'name'=>$data['name'],
           'email'=>$data['email'],
           'password'=>bcrypt($data['password'])
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil, silakan login.'
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            
            Log::warning('Login gagal', [
                'email' => $request->email,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'time' => now(),
            ]);

            return response()->json([
                'message' => ' Email atau password salah'
            ], 401);
        }

        return $this->respondWithToken($token);
    }

    public function logout() {
        auth('api')->logout();
        return response()->json(['message'=>'Successfully logged out']);
    }

    protected function respondWithToken($token) {
        return response()->json([
           'access_token'=>$token,
           'token_type'=>'bearer',
           'expires_in'=>auth('api')->factory()->getTTL()*60
        ]);
    }

}
