'use client';

import React from 'react';
import {
    List,
    ListItem,
    Typography,
    Chip,
    Box,
    Container,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Fab,
    TextField,
    DialogContentText,
} from '@mui/material';
import { Plus } from 'lucide-react';

import { Email } from '@/common/types/email';

export default function InboxPage() {
    const [tabValue, setTabValue] = React.useState(0);
    const [emails, setEmails] = React.useState<Email[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [selectedEmail, setSelectedEmail] = React.useState<Email | null>(null);
    const [composeOpen, setComposeOpen] = React.useState(false);
    const [emailForm, setEmailForm] = React.useState({
        receiver_email: '',
        subject: '',
        body: '',
        is_spam: false
    });

    React.useEffect(() => {
        const fetchEmails = async () => {
            try {
                // Move cookie access inside useEffect where we're guaranteed to be on the client side
                const accessToken = document.cookie.split('access_token=')[1]?.split(';')[0];
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/inbox`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch emails');
                }

                const data = await response.json();
                setEmails(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load emails');
            } finally {
                setLoading(false);
            }
        };

        fetchEmails();
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // const handleEmailClick = (email: Email) => {
    //     setSelectedEmail(email);
    // };

    const handleEmailClick = async (email: Email) => {
        if (!email.is_read) {
            try {
                const accessToken = document.cookie.split('access_token=')[1]?.split(';')[0];
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/${email.id}/read`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                // Update the email list to mark this email as read
                setEmails(prevEmails => 
                    prevEmails.map(e => 
                        e.id === email.id ? { ...e, is_read: true } : e
                    )
                );
            } catch (err) {
                console.error('Failed to mark email as read:', err);
            }
        }
        setSelectedEmail(email);
    };

    const handleCloseDialog = () => {
        setSelectedEmail(null);
    };

    const truncateBody = (body: string) => {
        const words = body.split(' ');
        if (words.length <= 15) { return body };
        return words.slice(0, 15).join(' ') + '...';
    };

    const truncateEmail = (email: string) => {
        const words = email;
        if (words.length <= 20) { return email };
        return words.slice(0, 20) + '...';
    };

    // Filter emails based on selected tab
    const filteredEmails = emails.filter(email => {
        if (tabValue === 0) { // Inbox tab
            return true; // Show all emails
        } else { // Spam tab
            return email.is_spam;
        }
    });

    const handleComposeClick = () => {
        setComposeOpen(true);
    };

    const handleComposeClose = () => {
        setComposeOpen(false);
        setEmailForm({ receiver_email: '', subject: '', body: '', is_spam: false });
    };

    const handleEmailFormChange = (field: keyof typeof emailForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailForm(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSendEmail = async () => {
        try {
            const accessToken = document.cookie.split('access_token=')[1]?.split(';')[0];
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailForm)
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            handleComposeClose();
            // Optionally refresh the email list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send email');
        }
    };

    const handleMarkAsSpam = async (email: Email) => {
        try {
            const accessToken = document.cookie.split('access_token=')[1]?.split(';')[0];
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/emails/${email.id}/mark-spam`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark email as spam');
            }

            // Update the emails list to reflect the change
            setEmails(prevEmails =>
                prevEmails.map(e =>
                    e.id === email.id ? { ...e, is_spam: true } : e
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark as spam');
        }
    };

    return (
        <Container maxWidth="sm" sx={{minHeight:'100vh', position: 'relative' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    variant="fullWidth"
                    textColor="inherit"
                    sx={{
                        '& .MuiTab-root': { color: '#666666' },
                        '& .Mui-selected': { color: 'black', fontWeight: 'semi-bold' },
                        '& .MuiTabs-indicator': { backgroundColor: 'black' }
                    }}
                >
                    <Tab label="Inbox" />
                    <Tab label="Spam Detected" />
                </Tabs>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <List>
                    {filteredEmails.map((email, index) => (
                        <ListItem
                            key={`email-${index}`}
                            sx={{
                                mb: 1,
                                borderRadius: 1,
                                cursor: 'pointer',
                                backgroundColor: email.is_read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                                '&:hover': {
                                    backgroundColor: email.is_read ? 'rgba(0, 0, 0, 0.04)' : 'rgba(25, 118, 210, 0.12)',
                                },
                            }}
                            onClick={() => handleEmailClick(email)}
                        >
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography 
                                        variant="subtitle1" 
                                        component="div" 
                                        sx={{ 
                                            color: 'black',
                                            fontWeight: email.is_read ? 400 : 600
                                        }}
                                    >
                                        {truncateEmail(email.sender.email)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        {email.is_spam ? (
                                            <Chip
                                                label="Spam"
                                                size="small"
                                                sx={{bgcolor: '#FPEFF0', color: '#7F4A47'}}
                                            />
                                        ) : (
                                            <Chip
                                                label="Not Spam"
                                                size="small"
                                                sx={{bgcolor: '#EDF5F0', color: '#2A4236'}}
                                            />
                                        )}
                                        {!email.is_read && (
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#1976d2',
                                                    marginRight: 1
                                                }}
                                            />
                                        )}
                                    </Box>
                                    
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    <Typography 
                                        variant="subtitle2" 
                                        component="div"
                                        sx={{color: 'black'}}
                                    >
                                        {email.subject}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        component="div"
                                        color="text.secondary"
                                    >
                                        {truncateBody(email.body)}
                                    </Typography>
                                </Box>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}

            <Dialog open={selectedEmail !== null} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                {selectedEmail && (
                    <>
                        <DialogTitle>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">{selectedEmail.subject}</Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="subtitle1" gutterBottom>
                                From: {selectedEmail.sender.email}
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {selectedEmail.body}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                                {!selectedEmail.is_spam && (
                                    <Button
                                        variant="outlined"
                                        sx={{bgcolor:'#AB0000', color:'white'}}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkAsSpam(selectedEmail);
                                        }}
                                    >
                                        Mark as Spam
                                    </Button>
                                )}
                            <Button onClick={handleCloseDialog} sx={{bgcolor:'black', color:'white'}}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
            <Fab 
                color="primary" 
                sx={{ 
                    position: 'fixed', 
                    bottom: 16, 
                    right: 16,
                    bgcolor: 'black',
                    '&:hover': {
                        bgcolor: '#333'
                    }
                }}
                onClick={handleComposeClick}
            >
                <Plus />
            </Fab>

            <Dialog open={composeOpen} onClose={handleComposeClose} fullWidth maxWidth="sm">
                <DialogTitle>Send Email</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Compose your email below
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="To"
                        type="email"
                        fullWidth
                        value={emailForm.receiver_email}
                        onChange={handleEmailFormChange('receiver_email')}
                    />
                    <TextField
                        margin="dense"
                        label="Subject"
                        type="text"
                        fullWidth
                        value={emailForm.subject}
                        onChange={handleEmailFormChange('subject')}
                    />
                    <TextField
                        margin="dense"
                        label="Message"
                        multiline
                        rows={4}
                        fullWidth
                        value={emailForm.body}
                        onChange={handleEmailFormChange('body')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleComposeClose} sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#ddd' }, color: 'black' }}>Cancel</Button>
                    <Button onClick={handleSendEmail} variant="contained" sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}>
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}