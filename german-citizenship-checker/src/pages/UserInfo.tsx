import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Avatar, TextField, Button, Fade } from '@mui/material';
import Header from '../components/Header';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { FormState } from '../types';

const AVATARS = ['/Avatar1.png'];
const CHAT_TEXT = "Welcome! Please share your name and email so we can guide you through the process.";

interface UserInfoProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}

const UserInfo = ({ formState, setFormState }: UserInfoProps) => {
  // Pick a random avatar on mount
  const avatar = useMemo(() => AVATARS[Math.floor(Math.random() * AVATARS.length)], []);
  const [showInputs, setShowInputs] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);

  // Robust typewriter effect for chat bubble
  useEffect(() => {
    setTypedText(''); // Only clear once at the start
    let i = 0;
    function typeNext() {
      setTypedText(CHAT_TEXT.slice(0, i + 1));
      if (i < CHAT_TEXT.length - 1) {
        i++;
        timeoutRef.current = window.setTimeout(typeNext, 30);
      }
    }
    typeNext();
    
    // Show inputs after 800ms, independent of typing animation
    const inputTimer = window.setTimeout(() => {
      setShowInputs(true);
    }, 800);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(inputTimer);
    };
  }, []);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({
      ...prev,
      userData: {
        ...prev.userData,
        fullName: name,
        email: email,
      }
    }));
    navigate('/questions');
  };

  return (
    <>
      <Header showBackButton onBack={() => navigate('/')} />
      <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#232946', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        {/* Avatar and chat bubble group */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
          <Avatar src={avatar} sx={{ width: 72, height: 72, mb: 2, bgcolor: '#646cff', boxShadow: 3 }} />
          <Box sx={{ bgcolor: '#fff', color: '#232946', borderRadius: 3, px: 3, py: 2, fontSize: 18, fontWeight: 500, boxShadow: 2, maxWidth: 340, minHeight: 56, textAlign: 'center' }}>
            {typedText}
          </Box>
        </Box>
        {/* Input fields in a separate card */}
        <Fade in={showInputs} timeout={700}>
          <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 6, bgcolor: '#1a1a1a' }}>
            <Box component="form" onSubmit={handleContinue} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                fullWidth
                autoFocus
                InputProps={{
                  style: {
                    background: '#fff',
                    borderRadius: 8,
                    fontSize: 18,
                    fontWeight: 500,
                    color: '#232946',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
                  }
                }}
                InputLabelProps={{ shrink: false }}
              />
              <TextField
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                fullWidth
                InputProps={{
                  style: {
                    background: '#fff',
                    borderRadius: 8,
                    fontSize: 18,
                    fontWeight: 500,
                    color: '#232946',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
                  }
                }}
                InputLabelProps={{ shrink: false }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  fontSize: 18,
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #646cff, #535bf2)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #535bf2, #646cff)',
                  },
                }}
              >
                Continue
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </>
  );
};

export default UserInfo; 