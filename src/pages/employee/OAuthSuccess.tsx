import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useSnackbar } from '../../hooks/useSnackbar';
import { getApiUrl } from '../../config/env';

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showSuccess, showError } = useSnackbar();
  const didLogin = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider') || 'Google';

    if (token && !didLogin.current) {
      didLogin.current = true;
      
      // Fetch user info with the token
      fetch(getApiUrl('/users/me'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            login(token, 'user', data.data);
            showSuccess(`Autentificare reușită cu ${provider}!`);
            navigate('/employee/home');
          } else {
            showError('Eroare la autentificare OAuth!');
            navigate('/employee/login');
          }
        })
        .catch(() => {
          showError('Eroare la autentificare OAuth!');
          navigate('/employee/login');
        });
    } else {
      showError('Token lipsă!');
      navigate('/employee/login');
    }
  }, [searchParams, login, showSuccess, showError, navigate]);

  return <div className="p-8 text-center">Se finalizează autentificarea...</div>;
}