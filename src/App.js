import React, { useState, useEffect, useRef, useCallback } from 'react'; // Added useCallback

// Material-UI Imports
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  // Grid // Not used in this version
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material'; // For delete icon

// Define a list of positive emojis for tagging
const positiveEmojis = [
  '✨', '🎉', '🚀', '🌟', '💪', '💖', '💡', '🌈', '🏆', '✅',
  '👍', '👏', '🥳', '🤩', '💯', '😊', '😁', '🥳', '🎊', '💫'
];

// Create a custom Material-UI theme with psychologically positive colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#64B5F6', // Light Blue 300 - cheerful, optimistic
    },
    secondary: {
      main: '#FFB300', // Amber 600 - energetic, warm
    },
    success: {
      main: '#81C784', // Light Green 300 - growth, positive
    },
    background: {
      default: '#F5F5F5', // Light Grey 100 - clean, light base
      paper: '#FFFFFF', // White for cards/surfaces
    },
    text: {
      primary: '#424242', // Dark grey for readability
      secondary: '#757575', // Medium grey
    },
  },
  typography: {
    fontFamily: 'Raleway, sans-serif', // Default body font is Raleway
    h1: {
      fontFamily: 'Baloo 2, sans-serif', // H1 title uses Baloo 2
      fontSize: '3.5rem',
      fontWeight: 700,
      color: '#FF7043', // Deep Orange 400 for a vibrant title
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    },
    h2: {
      fontFamily: 'Baloo 2, sans-serif', // H2 titles use Baloo 2
      fontSize: '2rem',
      fontWeight: 600,
      color: '#FF7043', // Deep Orange 400
    },
    h3: { // New typography variant for the subheading
      fontFamily: 'Quicksand, sans-serif',
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#4CAF50', // Green 500 for a fresh, positive feel
      mb: 2, // Margin bottom for spacing
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // More rounded buttons
          textTransform: 'none', // Keep original casing
          fontWeight: 600,
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', // Subtle shadow
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12, // Rounded text field
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16, // More rounded cards
          boxShadow: '0px 8px 20px rgba(0,0,0,0.08)', // Enhanced shadow
          // Define keyframes for the animation
          '@keyframes milestonePop': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)' },
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const App = () => {
  const [wins, setWins] = useState([]);
  const [newWinText, setNewWinText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨'); // Default emoji
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  // Removed Firebase related states: db, auth, userId, isAuthReady
  const [currentDailyWinCount, setCurrentDailyWinCount] = useState(0);
  const [isAnimatingMilestone, setIsAnimatingMilestone] = useState(false); // State to trigger animation
  const lastAnimatedMilestoneRef = useRef(-1); // To prevent re-animating on re-renders

  const emojiPickerRef = useRef(null);

  // Helper function to format date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  // Calculate the current day's win count (no longer filtered by userId)
  // Wrapped in useCallback to provide a stable function reference
  const calculateDailyWinCount = useCallback((allWins) => {
    if (allWins.length === 0) {
      return 0;
    }

    const today = formatDateToYYYYMMDD(Date.now());
    // Filter wins for today's date
    const winsToday = allWins.filter(win =>
      formatDateToYYYYMMDD(win.timestamp) === today
    );

    return winsToday.length;
  }, []); // Empty dependency array because formatDateToYYYYMMDD is a pure function and Date.now() is always new

  // Load wins from local storage on initial mount
  useEffect(() => {
    try {
      const storedWins = localStorage.getItem('winningStreakWins');
      if (storedWins) {
        const parsedWins = JSON.parse(storedWins);
        // Ensure wins are sorted by timestamp in descending order
        parsedWins.sort((a, b) => b.timestamp - a.timestamp);
        setWins(parsedWins);
      }
    } catch (error) {
      console.error("Error loading wins from local storage:", error);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save wins to local storage whenever the wins state changes
  useEffect(() => {
    try {
      localStorage.setItem('winningStreakWins', JSON.stringify(wins));
      // Recalculate daily win count whenever wins change
      setCurrentDailyWinCount(calculateDailyWinCount(wins));
    } catch (error) {
      console.error("Error saving wins to local storage:", error);
    }
  }, [wins, calculateDailyWinCount]); // Added calculateDailyWinCount to dependencies

  // Effect to trigger milestone animation (remains the same)
  useEffect(() => {
    const milestones = [1, 5, 10, 25, 50, 100]; // Defined psychologically positive increments

    // Trigger animation if current count is a milestone AND it's a new milestone reached
    if (milestones.includes(currentDailyWinCount) && currentDailyWinCount > lastAnimatedMilestoneRef.current) {
      setIsAnimatingMilestone(true);
      lastAnimatedMilestoneRef.current = currentDailyWinCount; // Update the last animated milestone

      const timer = setTimeout(() => {
        setIsAnimatingMilestone(false);
      }, 500); // Duration of the animation

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [currentDailyWinCount]); // Re-run when daily win count changes

  // Handle clicks outside the emoji picker (remains the same)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleAddWin = () => {
    if (!newWinText.trim()) { // No need to check db or userId
      setFeedbackMessage("Please enter a win description.");
      return;
    }

    const newWin = {
      id: Date.now(), // Use timestamp as unique ID for local storage
      text: newWinText,
      emoji: selectedEmoji,
      timestamp: Date.now(),
      // userId is no longer stored for local storage version
    };

    // Update wins state, which will trigger the useEffect to save to local storage
    setWins(prevWins => {
      const updatedWins = [newWin, ...prevWins];
      // Keep sorted by timestamp in descending order
      updatedWins.sort((a, b) => b.timestamp - a.timestamp);
      return updatedWins;
    });

    setNewWinText('');
    setSelectedEmoji('✨');
    setShowEmojiPicker(false);
    setFeedbackMessage('🎉 Awesome! Your tiny win has been recorded!');
  };

  const handleDeleteWin = (id) => {
    // Filter out the win to be deleted
    const updatedWins = wins.filter(win => win.id !== id);
    // Update wins state, which will trigger the useEffect to save to local storage
    setWins(updatedWins);
    setFeedbackMessage('Win successfully deleted!');
  };

  // Function to get dynamic styles and messages for the win count display (remains the same)
  const getWinCountReinforcement = (count) => {
    let bgColor = theme.palette.secondary.main; // Default Amber
    let message = '';
    let shadowColor = 'rgba(255, 179, 0, 0.3)'; // Default Amber shadow

    if (count === 0) {
      bgColor = theme.palette.secondary.main;
      message = 'Let\'s get started!';
      shadowColor = 'rgba(255, 179, 0, 0.3)';
    } else if (count === 1) {
      bgColor = theme.palette.primary.main; // Light Blue
      message = 'First win of the day!';
      shadowColor = 'rgba(100, 181, 246, 0.4)'; // Light Blue shadow
    } else if (count >= 2 && count <= 4) {
      bgColor = theme.palette.success.main; // Light Green
      message = 'Great progress!';
      shadowColor = 'rgba(129, 199, 132, 0.4)'; // Light Green shadow
    } else if (count >= 5 && count <= 9) {
      bgColor = theme.palette.primary.dark; // Darker Blue
      message = 'Fantastic momentum!';
      shadowColor = 'rgba(33, 150, 243, 0.5)'; // Darker Blue shadow
    } else if (count >= 10 && count <= 24) {
      bgColor = '#FF7043'; // Deep Orange (from h1 title)
      message = 'You\'re unstoppable!';
      shadowColor = 'rgba(255, 112, 67, 0.6)'; // Deep Orange shadow
    } else if (count >= 25 && count <= 49) {
      bgColor = '#FFC107'; // Amber 500
      message = 'Incredible dedication!';
      shadowColor = 'rgba(255, 193, 7, 0.7)';
    } else if (count >= 50 && count <= 99) {
      bgColor = '#4CAF50'; // Green 500
      message = 'Half-century of wins!';
      shadowColor = 'rgba(76, 175, 80, 0.7)';
    } else if (count >= 100) {
      bgColor = '#E91E63'; // Pink 500
      message = 'Century Club! Amazing!';
      shadowColor = 'rgba(233, 30, 99, 0.8)';
    }

    return { bgColor, message, shadowColor };
  };

  const { bgColor, message, shadowColor } = getWinCountReinforcement(currentDailyWinCount);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline resets default browser styles, including body margins/paddings */}
      <CssBaseline />
      {/* Link to Baloo 2 font from Google Fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap" />
      {/* Link to Quicksand font from Google Fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap" />
      {/* Link to Raleway font from Google Fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600&display=swap" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <Container
        // Removed maxWidth to allow full width
        // disableGutters removes the default horizontal padding of the Container
        disableGutters
        sx={{
          width: '100vw', // Ensure it takes full viewport width
          minHeight: '100vh', // Ensure it takes full viewport height
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // Removed py: 4 here as it will be applied to inner content
          bgcolor: 'background.default',
          background: 'linear-gradient(135deg, #E3F2FD 0%, #FFFDE7 100%)', // Light blue to light yellow gradient
        }}
      >
        {/* Inner Box to provide padding for content while background is full width */}
        <Box sx={{
          width: '100%', // Take full width of parent container
          maxWidth: 'md', // Re-apply max-width to content for readability
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4, // Apply vertical padding to content
          px: 2, // Apply horizontal padding to content
        }}>
          <Typography variant="h1" component="h1" gutterBottom sx={{ mb: 1 }}> {/* Reduced margin-bottom */}
            Winning Streak
          </Typography>
          <Typography variant="h3" component="h3" sx={{ mb: 4 }}> {/* Using new h3 variant for subheading */}
            Focus on today
          </Typography>

          {/* Current Daily Win Count Display */}
          <Paper
            elevation={4}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: bgColor, // Dynamic background color
              color: 'white',
              display: 'flex',
              flexDirection: 'column', // Allow message below count
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5, // Smaller gap
              borderRadius: 25, // Pill shape
              boxShadow: `0px 6px 12px ${shadowColor}`, // Dynamic shadow color
              minWidth: '200px', // Ensure it doesn't shrink too much
              textAlign: 'center',
              transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth transitions
              animation: isAnimatingMilestone ? 'milestonePop 0.5s ease-out' : 'none', // Apply animation conditionally
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" component="span">🚀</Typography>
              <Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
                Wins Today: {currentDailyWinCount}
              </Typography>
              <Typography variant="h5" component="span">🚀</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'white', mt: 0.5 }}>
              {message}
            </Typography>
          </Paper>

          {/* Feedback Snackbar */}
          <Snackbar
            open={!!feedbackMessage}
            autoHideDuration={3000}
            onClose={() => setFeedbackMessage('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setFeedbackMessage('')} severity="success" sx={{ width: '100%' }}>
              {feedbackMessage}
            </Alert>
          </Snackbar>

          {/* Add New Win Section */}
          <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 600, mb: 4, bgcolor: 'background.paper' }}>
            <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
              Celebrate a Tiny Win!
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="What's your tiny win today?"
                variant="outlined"
                value={newWinText}
                onChange={(e) => setNewWinText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddWin();
                  }
                }}
                sx={{ flexGrow: 1 }}
              />
              <Box sx={{ position: 'relative'} } ref={emojiPickerRef}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    minWidth: '64px', // Ensure button is square for emoji
                    height: '56px', // Match TextField height
                    fontSize: '2rem',
                    boxShadow: '0px 4px 8px rgba(0,0,0,0.15)',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    p: 0, // Remove padding to center emoji
                  }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  aria-label="Choose emoji"
                >
                  {selectedEmoji}
                </Button>
                {showEmojiPicker && (
                  <Paper
                    elevation={3}
                    sx={{
                      position: 'absolute',
                      zIndex: 10,
                      top: '100%',
                      mt: 1,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      p: 1.5,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: 1,
                      maxWidth: 250,
                    }}
                  >
                    {positiveEmojis.map((emoji, index) => (
                      <IconButton
                        key={index}
                        sx={{
                          fontSize: '1.5rem',
                          p: 1,
                          bgcolor: selectedEmoji === emoji ? 'primary.light' : 'transparent',
                          borderRadius: '8px',
                          '&:hover': {
                            bgcolor: 'primary.light',
                          },
                          border: selectedEmoji === emoji ? '2px solid' : 'none',
                          borderColor: selectedEmoji === emoji ? 'secondary.main' : 'transparent',
                        }}
                        onClick={() => {
                          setSelectedEmoji(emoji);
                          setShowEmojiPicker(false);
                        }}
                        aria-label={`Select emoji ${emoji}`}
                      >
                        {emoji}
                      </IconButton>
                    ))}
                  </Paper>
                )}
              </Box>
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleAddWin}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                boxShadow: '0px 6px 12px rgba(255, 179, 0, 0.25)',
                '&:hover': {
                  bgcolor: 'secondary.dark',
                },
              }}
            >
              Add Tiny Win!
            </Button>
          </Paper>

          {/* Wins List Section */}
          <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
            <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3 }}>
              Your Celebrations
            </Typography>
            {wins.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No tiny wins yet! Add your first one above. 😊
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {wins.map((win) => (
                  <Paper
                    key={win.id}
                    elevation={2}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: 'primary.light', // Light primary background for list items
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}> {/* Added flexGrow */}
                      <Typography variant="h4" component="span" sx={{ mr: 2 }}>{win.emoji}</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}> {/* Simplified this Box */}
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{win.text}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(win.timestamp).toLocaleDateString()} at {new Date(win.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        {/* userId is no longer displayed for local storage version */}
                      </Box>
                    </Box>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteWin(win.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Box> {/* End of inner Box for content padding */}
      </Container>
    </ThemeProvider>
  );
};

export default App;
