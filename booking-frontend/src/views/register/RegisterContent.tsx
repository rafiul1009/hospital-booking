'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ErrorMessage from '@/components/message/ErrorMessage';
import { useDispatch } from 'react-redux';
import AuthService from '@/services/api/auth.service';
import { setUser } from '@/store/slices/auth';

export default function RegisterContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();
  const dispatch = useDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and confirm password must match');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      AuthService.register(name, email, password)
        .then(data => {
          setIsSubmitting(false)

          if (data.data) {
            dispatch(setUser(data.data))
            router.push('/bookings')
          } else {
            setError('Registration failed. Please try again.');
          }
        })
        .catch(error => {
          setIsSubmitting(false)
          setError(error.message || 'Registration failed. Please try again.');
        })
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-bold text-center">Register</h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorMessage message={error} />}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Register'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          <Link href="/" className="font-semibold text-primary">
            Back to Home
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}