"use client";

import Image from "next/image";
import { Box, Container, Typography, Button, Grid, Paper } from "@mui/material";
import { Shield, Mail, Brain, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Shield size={32} />,
      title: "Advanced Spam Detection",
      description: "AI-powered algorithms to identify and filter unwanted emails with high accuracy"
    },
    {
      icon: <Mail size={32} />,
      title: "Clean Inbox",
      description: "Keep your inbox organized and free from spam, focusing on important messages"
    },
    {
      icon: <Brain size={32} />,
      title: "Smart Learning",
      description: "Continuously improving detection through machine learning and user feedback"
    },
    {
      icon: <Lock size={32} />,
      title: "Secure Email",
      description: "Protect your inbox from phishing attempts and malicious content"
    }
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: "black", 
        color: "white", 
        py: { xs: 5, sm: 8, md: 12 },
        textAlign: "center" 
      }}>
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
            }}
          >
            Protect Your Inbox from Spam
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              color: "#999",
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Advanced AI-powered spam detection for a cleaner, safer email experience
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => router.push("/register")}
            sx={{ 
              bgcolor: "white", 
              color: "black",
              '&:hover': {
                bgcolor: "#f0f0f0"
              },
              mr: { xs: 1, sm: 2 },
            }}
          >
            Get Started
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => router.push("/login")}
            sx={{ 
              color: "white",
              borderColor: "white",
              '&:hover': {
                borderColor: "#f0f0f0",
                bgcolor: "rgba(255,255,255,0.1)"
              },
              mr: { xs: 1, sm: 2 },
            }}
          >
            Sign In
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <Typography 
          variant="h4" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            mb: { xs: 3, sm: 4 }
          }}
        >
          Why Choose MailGuard?
        </Typography>
        <Grid 
          container 
          spacing={{ xs: 2, sm: 3, md: 4 }} 
          sx={{ 
            mt: { xs: 2, sm: 3 },
            justifyContent: "center" 
          }}
        >
          {features.map((feature, index) => (
            <Grid 
              key={index}
              component="div"
              sx={{
                width: {
                  xs: '100%',
                  sm: '50%',
                  md: '25%'
                },
                maxWidth: {
                  xs: '100%',
                  sm: '50%',
                  md: '25%'
                },
                flexGrow: 0
              }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  bgcolor: "transparent"
                }}
              >
                <Box sx={{ color: "black", mb: { xs: 1, sm: 2 } }}>
                  {feature.icon}
                </Box>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: "#e0e0e0", py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
            }}
          >
            Ready to Take Control of Your Inbox?
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Join thousands of users who trust MailGuard for their email security
          </Typography>
          <Button 
            variant="contained"
            size="large"
            onClick={() => router.push("/register")}
            sx={{ 
              bgcolor: "black",
              '&:hover': {
                bgcolor: "#333"
              },
              py: { xs: 1, sm: 1.5 },
              px: { xs: 3, sm: 4 }
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
}